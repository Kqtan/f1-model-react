from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import confusion_matrix, roc_curve, auc
import joblib
import pandas as pd

def prep_data(input_data, GP_name, const_names):
    """
        json contains
        driver: list
        const: list
        quali_pos: list
        GP_name: string
    """
    data = pd.DataFrame(input_data)
    data['constructor'] = data['constructor'].map(const_names).fillna(data['constructor'])

    driver_df = pd.read_csv('project/drivers.csv')
    driver_df = driver_df[driver_df['GP_name']==GP_name]
    driver_df["dob"] = pd.to_datetime(driver_df["dob"])
    driver_df["date_first_race"] = pd.to_datetime(driver_df["date_first_race"])

    const_df = pd.read_csv('project/constructors.csv')
    const_df = const_df[const_df['GP_name']==GP_name]
    const_df = const_df.drop(['GP_name'], axis=1)

    # best to use GP date
    driver_df["age_gp_days"] = (pd.Timestamp("today") - driver_df["dob"]).dt.days
    driver_df["exp_days"] = (pd.Timestamp("today") - driver_df["date_first_race"]).dt.days
    
    data = pd.merge(data, driver_df, on='driver', how='left')
    data = pd.merge(data, const_df, on='constructor', how='left')
    return data

def position_index(x):
    if x<4:
        return 1
    elif x>10:
        return 3
    else :
        return 2

def debutant(row):
    if row['constructor_home'] and row['const_relaiblity']>=0.95 and row['quali_pos']<4:
        prediction = 1
    elif row['constructor_home'] and row['const_relaiblity']>=0.95:
        prediction = 2
    elif row['quali_pos']<11 and row['const_relaiblity']>=0.92:
        prediction = 2
    else:
        prediction = 3
    return prediction

def pipeline_predict(input_data):
    """
    input_data: dataframe
    """
    input_data = input_data.drop(['active_driver', 'dob', 'date_first_race', 'active_const'], axis=1)
    condition = input_data['best_position'].isna()
    no_data = input_data[condition].copy()
    input_data = input_data[~condition].copy()

    pipeline = joblib.load('project/f1_lr.joblib')

    y_pred = pipeline.predict(input_data)
    y_pred_proba = pipeline.predict_proba(input_data)[:, 1]
    no_data['prediction'] = no_data.apply(debutant, axis=1)

    input_data['prediction'] = y_pred.tolist()
    input_data = pd.concat([input_data, no_data]).reset_index()
    output = input_data[['driver', 'constructor', 'prediction']]
    return output

# json = {
#     'driver': ['Alexander Albon'],
#     'constructor': ['Williams'],
#     'quali_pos': [10]
# }
# prep_data(json, 'Autódromo José Carlos Pace')