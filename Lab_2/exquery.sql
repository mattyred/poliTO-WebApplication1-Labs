-- SQLite
SELECT * FROM films WHERE (watchdate < DATE(?) AND watchdate <> NULL)