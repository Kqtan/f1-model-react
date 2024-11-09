# F1-react-app

# Introduction
- PoC on F1 race prediction with a proper FE
- Part of my effort to learn JS and React
- Working on classification model to predict F1 results

# Content
## Back-End
- written in Flask, with proxy routed from React FE
- I have written some Flask app with Jinja template but not with a proper FE
- this time i am using dotenv, using `flask run` to run the server, rather `python app.py`
- no DB set up this time, planned to set up pgsql to store some data, somehow all the data can be retrieve from the API
- shoutout to: https://ergast.com

### The Model
- some of the data used to do the training and testing

| Column Used        | Type  | Description   |
| ------------------ | ----- | ------------- |
| Driver_Home        | Int   | Row 1, Cell 3 |
| Driver_Confidence  | Float | Row 2, Cell 3 |
| Best_Position      | Int   | Row 3, Cell 3 |
| Driver_Score       | Float | Row 3, Cell 3 |
| Age_days           | Int   | Row 3, Cell 3 |
| Experience_days    | Int   | Row 3, Cell 3 |
| Constructor_Home   | Int   | Row 3, Cell 3 |
| Const_Reliability  | Float | Row 3, Cell 3 |

- the process is somehow not here, will include when the training process is mature
- Some consideration to change:
    - Scaling for all the variables
    - Data is too old, the model have to be retrained
    - Logistic Regression is insufficient to predict the complexity of the race
    - There are so many variables to be included, that will direct or indirectly affect the result
- The Algorithm for driver score is *self-written*, LFG. Not a bad _shit_ ngl

## Front-End
- written in React.js and css
- somesort of suck, still learning syntax
- kind of learning `this`, `state`, `const`
- Nothing much to talk about, still WIP.

# Contact
- Will deploy when the model is fixed. Also adding more feature.
- For anymore suggestions, please contact me at kqdev0199@gmail.com