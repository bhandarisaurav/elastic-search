# 1. Create an index having fields of the following types. Disable dynamic mapping for this index.
#Hint: This means to create an index with mapping having following types in properties.


PUT organization
{
  "mappings":{
    "_doc":{
      "dynamic": false,
       "properties":{
        "name":{
          "type":"text"
        },
        "Contact":{
          "properties":{
            "phone":{
              "type":"keyword"
              }
          }
        },
        "grossIncome":{
          "type":"double"
        },
        "totalSalary":{
         "type":"long"
       },
       "fired":{
          "type":"boolean"
        },
        "total_employees":{
          "type":"integer"
        },
		"established_date":{
          "type":"date",
          "format":"MM-dd-yyyy || yyyy/mm/dd"
        },
        "owners":{
           "type":"nested",
          "properties":{
            "name":{
              "type":"text"
            },
            "position":{
              "type":"text"
            }
          }
        },
		"area":{
         "type":"integer_range"
       }
      }
        }
}
}

# Insert two valid documents, that is, with fields which match the types mentioned in (1)

PUT company/_doc/1
{
  "name":"Verisk Pvt Ltd",
  "Contact":{
    "phone":"01-456657"
  },
  "grossIncome":512323342332.56,
  "totalSalary":2212343,
  "profitStatus":true,
  "total_employees":245,
  "established_date":"01-02-2010",
  "owner":{
    "name":"Ramesh Raja Shrestha",
    "position":"CAO"
  },
   "area":{
    "gt":20,
    "lt":40
  }
  }


PUT company/_doc/2
{
  "name":"Google Pvt Ltd",
  "Contact":{
    "phone":"01-12324657"
  },
  "grossIncome":5123292362342332.56,
  "totalSalary":2233312343,
  "profitStatus":true,
  "total_employees":245097,
  "established_date":"01-02-2010",
  "owner":{
    "name":"Sundar Pichai",
    "position":"CEO"
  },
   "area":{
    "gt":2023,
    "lt":4320
  }
  }
  
  # Try inserting an invalid document to see the exception thrown. 
  
  PUT company/_doc/3
{
    "name":"XYZ Pvt Ltd",
  "Contact":{
    "phone":"01-12324657"
  },
  "grossIncome":"2565",
  "totalSalary":2233312343,
  "profitStatus":585,
  "total_employees":245097,
  "established_date":"2010-02-01",
  "owner":{
    "name":fghjkl,
    "position":"CEO"
  },
   "area":{
    "gt":2023,
    "lt":4320
  }
  }
  
  
  #Use curl command along with _bulk API to insert the documents available in the file provided in mail (name: accounts.json) into accounts index.
  
curl -H 'Content-Type: application/json' -XPOST "http://localhost:9200/accounts/_doc/_bulk?pretty" --data-binary @accounts.json

#Perform queries using Request URI to find the following:
	
	##all documents

http://localhost:9200/accounts/_doc/_search?q=*

	##age greater than equal to 30 and less than equal to 70

http://localhost:9200/accounts/_doc/_search?q=age:[30%20TO%2070]

	##females with age less than equals 25

http://localhost:9200/accounts/_doc/_search?q=gender:F%20AND%20age:[*%20TO%2025]


	##males belonging to ME state

http://localhost:9200/accounts/_doc/_search?q=gender:M%20and%20state=ME


#Perform following _update_by_query operations on accounts:

   ##Add a new field expense_list whose value is empty array [ ] for all documents.

POST /accounts/_update_by_query?conflicts=proceed
{
  "query":{
    "match_all":{}
  },
  "script": {
    "source": "ctx._source.expense_list = []",
    "lang": "painless"
  }
      
  }
	##dd a value ‘student_loan’ into the expense_list array for members having age greater than equals 10 and less than equals 25

POST /accounts/_update_by_query?conflicts=proceed
{
  "query":{
    
   "match_all":{}
    },
  "script":{
    "lang":"painless",
    
  "source":"""
 String val= "student_loan";
  if(ctx._source.age>=10 && ctx._source.age<=25){
    ctx._source.expense_list.add(val)
  }
 
  """
 }
}
	##Add two values ‘car_loan’ and ‘house_loan’ into expense_list array for members having age greater than 25 and less than equals 50
	
POST /accounts/_update_by_query?conflicts=proceed
{
  "query":{
    "match_all":{}
  },
  
  "script":{
    "lang":"painless",
    
    "source":"""
    String val1="car_loan";
    String val2="house_loan";
    if(ctx._source.age>=25 && ctx._source.age<=50){
      ctx._source.expense_list.add(val1);
      ctx._source.expense_list.add(val2)
    }
    """
  }
}
	##Add a value ‘recreation’ for members having balance greater than equals 40000.

POST /accounts/_update_by_query?conflicts=proceed
{
  "query":{
    "match_all":{}
  },
  
  "script":{
    "lang":"painless",
    
    "source":"""
    String val="recreation";
   
    if(ctx._source.balance>=40000){
      ctx._source.expense_list.add(val)
      
    }
    """
  }
}
	##Decrease the balance by 2000 of members of state PA.

POST /accounts/_update_by_query?conflicts=proceed
{
  "query":{
    "match_all":{}
  },
  "script":{
    "lang":"painless",
    "source":"""
    if(ctx._source.state=="PA"){
      ctx._source.balance-=params.val
    }
    """,
    "params":{
      "val":2000
    }
  }
}


#Perform following queries using Request Body with any values you want to:

	##Term query
	##Range query
	##Prefix query
	##Wildcard Query

GET accounts/_search
{
  "query":{
    "term":{
      "country":{
        "value":"916 Rogers Avenue"
      }
  }
}
}

GET accounts/_search
{
  "query":{
  "range": {
    "class": {
      "gt": 12,
      "lte": 18
    }
  }
}
}


GET accounts/_search
{"query":{
  "prefix":{
    "firstname":"SAU"
    
  }
}
}

GET product/_search
{"query":{
  "wildcard":{
    "firstname":"s?"
    
  }
}
  }
  
#Refer to Terms query in Week II Notes to do the following question:

	#Create an index college having following fields:
	#batch (integer type): example values, 2017, 2018
	#students (nested type, i.e. array of inner objects): each inner object can have two properties id and name.
	
PUT college
{
  "mappings": {
    "_doc":{
      "properties":{
      "batch":{
        "type":"integer"
      },
      "students":{
      "type":"nested",
        "properties":{
          "id":{
            "type":"integer"
            
          },
          "name":{
            "type":"text"
          }
        }
      }
        
      }
    }
  }
}


#Insert a document with certain id (example, 1), your batch (example, 2017), and an array of 3 students in index college.

PUT college/_doc/1
{
  "batch":2019,
  "students":{
    "student_id":[123, 124, 125],
    "name":["Mahan Adhikari","Saurav Bhandari","Sabina Shrestha"]
  }
}

#Create an index workshop having following fields

	##students_id
	##workshop_about
	##enrolled_year

PUT workshop
{
  "mappings":{
    "_doc":{
      "properties":{
        "student_id":{
          "type":"integer"
        },
        "workshop_about":{
          "type":"text"
        },
        "enrolled_year":{
          "type":"date",
          "format":"yyyy"
        }
      }
    }
  }
}
#Bulk insert 5 documents in index workshop.

POST college/_doc/_bulk
{"index":{"_id":1}}
{"student_id":101,"enrolled_year":"2018","workshop_about":"PYTHON" }
{"index":{"_id":2}}
{"student_id":102,"enrolled_year":"2015","workshop_about":"GRAILS" }
{"index":{"_id":3}}
{"student_id":103,"enrolled_year":"2016","workshop_about":"C++"}
{"index":{"_id":4}}
{"student_id":104,"enrolled_year":"2019","workshop_about":"JAVA"}
{"index":{"_id":5}}
{"student_id":105,"enrolled_year":"2020","workshop_about":"PHP"  }

#Using terms query, find the students of your batch enrolled in any workshop.

GET workshop/_search
{
  "query": {
    "terms": {
      "workshop_about": {
        "index": "college",
        "type": "_doc",
        "id": 2,
        "path": "batch"
      }
    }
  }
}


  

  
  
  