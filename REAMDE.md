# Kickstarter Data Visualization

A web app to create information visualization for Kickstarter projects data. Data from [this web crawler](https://webrobots.io/kickstarter-datasets/ "webrockets.io") was optimized to a certain schema shown at the end. This is part of a group project at UMSI si649 w18 curriculum.

<br /><br />

#### Data encoding

- __% goal pledged__: radius (with a fixed offset)
- __Month of launch date__: angle (each sector will represent one month)
- __Sentiment score of blurb__: angle offset within a month sector

<br /><br />

#### Datum schema
```json
{
    "id": 2016865793,
    "name": "Support the Strange and Unusual, from fantasy to conspiracy",
    "state": "failed",
    "category_name": "Digital Art",
    "category_id": 21,
    "location_state": "CO",
    "create_date": "2012-03-23",
    "launch_date": "2012-03-26",
    "state_change": "2012-05-07",
    "deadline_at": "2012-05-07",
    "location_id": 2391279,
    "goal": 5400,
    "pledged": 20,
    "perc_pledged": 0.37,
    "backers_count": 1,
    "launched_to_deadline_days": 42,
    "blurb": "Monsters, Fantasy, Illusion, Delusion, and a hint of reality. Check out an excellent way I found to express my digital paintings!",
    "score": 0.6114,
    "creator_id": 987604337,
    "slug": "represent-the-strange-and-unusual"
}
```

