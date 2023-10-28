-- CREATE TABLE categories(id integer primary key, name text);
-- CREATE TABLE items(id integer primary key, name text, category_id integer, image_name text, foreign key (category_id) references categories(id));
CREATE TABLE events(group_id integer, name text, admin_id integer);
CREATE TABLE event_dates(id integer, group_id integer, date text, time_from text, time_to text, max_people integer, min_people integer, foreign key (group_id) references events(group_id));
CREATE TABLE event_attributes(id integer, date_id integer, max_people integer, min_people integer, foreign key (date_id) references events(id));
CREATE TABLE users(id integer, name text, group_id integer, foreign key (group_id) references events(group_id));
CREATE TABLE user_attributes(user_id integer,  attr_id integer, value boolean, foreign key (user_id) references users(id), foreign key (attr_id) references event_attributes(id));
CREATE TABLE user_dates(user_id integer, time_from text, time_to text, foreign key (user_id) references users(id));
CREATE TABLE shift(group_id integer, user_id integer, time_from text, time_to text, foreign key (user_id) references users(id), foreign key (group_id) references events(group_id));
