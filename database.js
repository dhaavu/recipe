create table receipe(
    row_id uuid PRIMARY KEY DEFAULT UUID_GENERATE_V4(), 
    name varchar(200), 
    type varchar(100), 
    procedure text, 
    url text
); 

create table ingredient(
    row_id uuid PRIMARY KEY DEFAULT UUID_GENERATE_V4(), 
    name varchar(200)
); 

create table receipe_ingredients ( 
    row_id uuid PRIMARY KEY DEFAULT UUID_GENERATE_V4(),
    ingredient_id varchar(100), 
    receipe_id varchar(100), 
    qty integer, 
    measure varchar(200)
); 

insert into receipe (name, type, procedure ) values ('Watermellon smoothie', 'Drinks', 'mix the ingredients and enjoy!!!'); 
insert into ingredient (name) values ('Watermellon'); 
insert into ingredient (name) values ('Lime juice'); 
insert into ingredient (name) values ('Salt'); 


insert into receipe_ingredients (receipe_id, ingredient_id, qty, measure) (select receipe.row_id, ingredient.row_id , 1, 'unit' from receipe , ingredient where ingredient.name = 'Watermellon'); 
insert into receipe_ingredients (receipe_id, ingredient_id, qty, measure) (select receipe.row_id, ingredient.row_id , 2, 'unit' from receipe , ingredient where ingredient.name = 'Lime juice'); 
insert into receipe_ingredients (receipe_id, ingredient_id, qty, measure) (select receipe.row_id, ingredient.row_id , 2, 'unit' from receipe , ingredient where ingredient.name = 'Salt'); 



select receipe.name, ingredient.name from receipe, ingredient, receipe_ingredients where 
receipe.row_id::text = receipe_ingredients.receipe_id and 
ingredient.row_id::text = receipe_ingredients.ingredient_id; 


select receipe.name, 
json_agg(json_build_object('ingredient', ingredient.name, 
'qty', receipe_ingredients.qty, 
'me', receipe_ingredients.measure)) 
from receipe, ingredient, receipe_ingredients where 
receipe.row_id::text = receipe_ingredients.receipe_id and 
ingredient.row_id::text = receipe_ingredients.ingredient_id 
group by receipe.name; 

'measure', receipe_ingredients.measure