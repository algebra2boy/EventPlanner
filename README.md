# Event Planners
A dockerized web app that helps people create and sign up events using Gmail and Yelp API.

# Requirements
You would need to create two .env file, one in Gmail, another one in Yelp.
- In Yelp service, you would need to add the API KEY, YELP_APIKEY, from [Yelp Developers](https://www.google.com/search?client=safari&rls=en&q=yelp+developer&ie=UTF-8&oe=UTF-8&dlnr=1&sei=SgjwZKLVNIe15NoPwLK2mAk).
- In Gmail service, you would need to add multiple OAuth2 authentication code, as they are CLIENT_ID, CLIENT_SECRET, REDIRECT_URL, REFRESH_TOKEN from Google API.

# How to run the web app
Note: You must have mongoDB and Docker installed in your local machine.
```
cd EventPlanner
docker compose up
```
how to stop the containers from running:
```
docker compose down
```
how to remove all unused objects such as images and containers:
```
docker system prune -a
```
how to remove all unused volumes:
```
docker volume prune -a
```

# More About This Project

[Where my ideas come from for this project?](https://github.com/algebra2boy/EventPlanner/blob/main/Ideas.md)

[Video demonstration from Youtube](https://youtu.be/SlSaHrCOxC0)