# Question 1 

PUT hiking
{
    "settings" : {
        "number_of_shards" : 5,
        "number_of_replicas" : 1
    }
}

# Question 2

PUT hiking/_doc/1
{
  "hiked_on":"1997/12/29",
  "coordinator":"Saurav Bhandari",
  "total_students":12,
  "cost":3456.67,
  "bus_booked":true,
  "tags":["food","games","travel"],
  "test_field" :"Food is Life"
  
}

PUT hiking/_doc/2
{
  "hiked_on":"1997/12/30",
  "coordinator":"Mahan Adhikari",
  "total_students":123,
  "cost":857.67,
  "bus_booked":false,
  "tags":["food","games","dancing"],
  "test_field" :"Gaming is Life"
  
}

#Question 3

GET hiking/_doc/1

GET hiking/_doc/_search?q=bus_booked:false

GET hiking/_doc/_search?q=test_field:life

GET hiking/_doc/1/_source

GET hiking/_doc/2?_source=false

GET hiking/_doc/1?_source_includes=tags,bus_booked

GET hiking/_doc/1?_source_excludes=test_field,tags,bus_booked

#Question 4

POST hiking/_doc/1/_update
{
  "doc":
        {
          "total_price":12333.87
        }
  
}

#Question 5

POST hiking/_doc/1/_update
{
  "script": {
    "lang":"painless",
    "source":"""ctx._source.destination='Kakani';ctx._source.remove('total_price');"""

  }
}

#Question 6

POST hiking/_doc/1/_update
{
  "script": {
        "lang": "painless",
        "source": "ctx._source.total_students+=params.students_to_add",
        "params": {
          "students_to_add": 1
        }
      }
}

GET hiking/_doc/1/_source



#POST hiking/_doc/1/_update
#{
#  "script":{
#   "lang":"painless",
#    "source":"""
#      String val=['hills','adventure','bonding','refreshment','fun'];
#      for (int i=0; i<5; i++){
#        if (ctx._source.total_students>=35){
#          ctx._source.tags.add(val[i])
#        }
#      }"""
#  }
#}

# Question 7


POST hiking/_doc/1/_update
{
  "script":{
    "lang":"painless",
    "source":"""
      for (int i=0; i<5; i++){
        if (ctx._source.total_students>=35){
          ctx._source.tags.add(params.new_tags[i])
        }
      }""",
      "params": {
        "new_tags":["hills","adventure","bonding","refreshment","fun"]
      }
  }
}

GET hiking/_doc/1/_source

GET hiking/_doc/2/_source