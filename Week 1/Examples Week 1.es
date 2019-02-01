
#View All Indices: localhost:9200/_cat/indices?v
#View All Shards: localhost:9200/_cat/shards?v
#Practical Examples (Kibana)

#Creating Index

PUT test_index

#Inserting Doc in the index with fields name (with text value), stock (with numeric value), tags (array), rated(with boolean value) and inserted_on (with date valye yyyy/MM/dd)

#Using PUT
PUT test_index/_doc/1
{"name":"productX","stock":5, "tags":["sports"], “rated”:true, “inserted_on”:”1994/05/12”}

#Using POST
POST test_index/_doc
{"name":"productY","stock":2, "tags":["technology"], “rated”:false, “inserted_on”:”2018/05/12”}

#Retrieving documents
By Id:
#GET test_index/_doc/1
Using _search: 
#GET test_index/_doc/_search

#Something More
#Get source directly
GET test_index/_doc/1/_source
#Exclude source
GET test_index/_doc/1?_source=false
#Get selective fields
GET test_index/_doc/1?_source_include=name,stock
#Exclude some fields
GET test_index/_doc/1?_source_exclude=stock

#using simple flat field in params to update
POST test_index/_doc/1/_update
{
  "script": {
        "lang": "painless",
        "source": "ctx._source.stock*=params.multiplier",
        "params": {
          "multiplier": 2
        }
      }
}

#adding new field without script
POST test_index/_doc/1/_update
{"doc":{"new_field":"new_value"}}


#adding new field with script
POST test_index/_doc/1/_update
{
  "script": {
    "lang":"painless",
    "source":"ctx._source.new_field2='new_value2'"
  }
}

#removing field with script
POST test_index/_doc/1/_update
{
  "script": {
    "lang":"painless",
    "source":"ctx._source.remove('new_field')"
  }
}



#adding a new field and removing another field together
POST test_index/_doc/1/_update
{
  "script": {
    "lang":"painless",
    "source":"""
      ctx._source.new_field3='new_val3';
      ctx._source.remove('new_field');
    """
  }
}

#adding multiple values to existing array- loop example
POST test_index/_doc/1/_update
{
  "script":{
    "lang":"painless",
    "source":"""
      for (int i=0; i<5; i++){
        String val='test_tag'+i;
        ctx._source.tags.add(val)
      }"""
  }
}

#adding multiple values to existing array- condition example
POST test_index/_doc/1/_update
{
  "script":{
    "lang":"painless",
    "source":"""
      for (int i=0; i<5; i++){
        String val='test_tag'+i;
        if (!ctx._source.tags.contains(val)){
          ctx._source.tags.add(val)
        }
      }"""
  }
}





