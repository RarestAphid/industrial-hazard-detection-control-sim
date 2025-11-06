from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/step1")
def step1():
    return render_template("step1.html")

@app.route('/instructions')
def instructions():
    return render_template('instructions.html')

if __name__ == "__main__":
    app.run(debug=True)
