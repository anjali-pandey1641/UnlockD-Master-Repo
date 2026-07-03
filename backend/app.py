from flask import Flask
from flask_cors import CORS
from schema import create_tables
from routes.transaction import transactions
from routes.budget import budgets
from routes.groups import groups
from routes.analytics import analytics
app = Flask(__name__)
CORS(app)

create_tables()

app.register_blueprint(transactions)
app.register_blueprint(budgets)
app.register_blueprint(groups)
app.register_blueprint(analytics)
@app.get("/")
def home():
    return {
        "message": "Unlock'D Backend Running"
    }

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)