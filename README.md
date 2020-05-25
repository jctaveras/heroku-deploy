# Heroku Deploy - GitHub Action

A simple action to build, push and deploy containers to you  Heroku app.

## How to use it

```yml
name: '' #set whatevername you want to your github job
on: {} # set the events you would like to trigger this job
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v2
      - name: Build, Push and Deploy to Heroku #set the whatever name you want to this step
        id: heroku
        uses: jctaveras/heroku-deploy@v1.0.0  # use the latest version of the action
        with:
          email: ${{ secrets.HEROKU_EMAIL }} # your heroku email
          api_key: ${{ secrets.HEROKU_API_KEY }} # your  heroku api key
          app_name: ${{ secrets.HEROKU_APP_NAME }} # you aplication name
          dockerfile: '' # set the path to the folder wher the Dokerfile is located
```

| Variables  | Required      |
|:----------:|:-------------:|
| email        | ✅|
| api_key      | ✅|
| app_name | ✅|
| dockerfile | ✅|
| options    | ❌|