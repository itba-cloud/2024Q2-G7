data "aws_iam_role" "current" {
  name = local.authorized_role
}

locals {
  authorized_role = "LabRole"
  role            = data.aws_iam_role.current.arn
  admin_email     = "getaway@gmail.com"
  frontend_dir    = "../frontend/build"
  resources_path  = "./resources"

  ####################################################################################################
  ############################################# VPC ##################################################
  ####################################################################################################

  vpc_cidr     = "10.0.0.0/16"
  vpc_az_count = 2
  vpc_endpoints = [
    { service : "dynamodb", type : "Gateway" },
    { service : "s3", type : "Gateway" },
  ]

  ####################################################################################################
  ########################################### DynamoDB ###############################################
  ####################################################################################################

  tables = {
    //--------------------------------------------
    //----------------EXPERIENCES-----------------
    //--------------------------------------------
    experiences = {
      table_name   = "experiences-table"
      billing_mode = "PAY_PER_REQUEST"
      attributes = {
        status   = { name = "status", type = "S" } #PENDING, VERIFIED
        category = { name = "category", type = "S" }
        user_id  = { name = "user_id", type = "S" }
        id       = { name = "id", type = "S" }
        #name     = { name = "name", type = "S" }
        #price    = { name = "price", type = "N" }
        #score    = { name = "score", type = "N" }
      }
      primary_keys = {
        hash_key  = "category"
        range_key = "id"
      }
      global_secondary_index = [
        {
          name            = "ByStatusIndex"
          hash_key        = "status"
          range_key       = "id"
          projection_type = "ALL"
        },
        {
          name            = "ByUserIndex"
          hash_key        = "user_id"
          range_key       = "status"
          projection_type = "ALL"
        }
      ]
      #local_secondary_indexes = [
      #  {
      #    name            = "ByNameIndex"
      #    range_key       = "name"
      #    projection_type = "ALL"
      #  },
      #  {
      #    name            = "ByPriceIndex"
      #    range_key       = "price"
      #    projection_type = "ALL"
      #  },
      #  {
      #    name            = "ByScoreIndex"
      #    range_key       = "score"
      #    projection_type = "ALL"
      #  }
      #]
    }
    //--------------------------------------------
    //------------------REVIEWS-------------------
    //--------------------------------------------
    reviews = {
      table_name   = "reviews-table"
      billing_mode = "PAY_PER_REQUEST"
      attributes = {
        category      = { name = "category", type = "S" } #EXPERIENCE, AGENT
        experience_id = { name = "experience_id", type = "S" }
        agent_id      = { name = "agent_id", type = "S" }
        user_id       = { name = "user_id", type = "S" }
        date          = { name = "date", type = "S" }
        id            = { name = "id", type = "S" }
      }
      primary_keys = {
        hash_key  = "category"
        range_key = "id"
      }
      global_secondary_index = [
        {
          name            = "ByExperienceIndex"
          hash_key        = "experience_id"
          range_key       = "date"
          projection_type = "ALL"
        },
        {
          name            = "ByAgentIndex"
          hash_key        = "agent_id"
          range_key       = "date"
          projection_type = "ALL"
        },
        {
          name            = "ByUserIndex"
          hash_key        = "user_id"
          range_key       = "date"
          projection_type = "ALL"
        }
      ]
    },
    //--------------------------------------------
    //-----------------LOCATION-------------------
    //--------------------------------------------
    location = {
      table_name   = "location-table"
      billing_mode = "PAY_PER_REQUEST"
      attributes = {
        province = { name = "province", type = "S" }
        city     = { name = "city", type = "S" }
      }
      primary_keys = {
        hash_key  = "province"
        range_key = "city"
      }
      global_secondary_index = []
    },
    //--------------------------------------------
    //-------------------USERS--------------------
    //--------------------------------------------
    users = {
      table_name   = "users-table"
      billing_mode = "PAY_PER_REQUEST"
      attributes = {
        PK = { name = "PK", type = "S" } # USERS
        id = { name = "id", type = "S" }
      }
      primary_keys = {
        hash_key  = "PK"
        range_key = "id"
      }
      global_secondary_index = []
    },
    //--------------------------------------------
    //-------------------TRIPS--------------------
    //--------------------------------------------
    trips = {
      table_name   = "trips-table"
      billing_mode = "PAY_PER_REQUEST"
      attributes = {
        user_id    = { name = "user_id", type = "S" }
        id         = { name = "id", type = "S" }
        start_date = { name = "start_date", type = "S" }
      }
      primary_keys = {
        hash_key  = "user_id"
        range_key = "id"
      }
      local_secondary_indexes = [
        {
          name            = "start_date_index"
          range_key       = "start_date"
          projection_type = "ALL"
        }
      ]
      global_secondary_index = []
    }
    //--------------------------------------------
    //-------------------AGENTS-------------------
    //--------------------------------------------
    agents = {
      table_name   = "agents-table"
      billing_mode = "PAY_PER_REQUEST"
      attributes = {
        status = { name = "status", type = "S" } #PENDING, VERIFIED
        id     = { name = "id", type = "S" }
      }
      primary_keys = {
        hash_key  = "status"
        range_key = "id"
      }
      global_secondary_index = []
    },
    //--------------------------------------------
    //-------------------ARTICLES-----------------
    //--------------------------------------------
    articles = {
      table_name   = "articles-table"
      billing_mode = "PAY_PER_REQUEST"
      attributes = {
        agent_id = { name = "agent_id", type = "S" }
        id       = { name = "id", type = "S" }
      }
      primary_keys = {
        hash_key  = "agent_id"
        range_key = "id"
      }
      global_secondary_index = []
    },
  }

  ####################################################################################################
  ############################################ LAMBDAS ###############################################
  ####################################################################################################

  lambda_sg_name          = "${var.project_name}-lambda-sg"
  internal_lambda_sg_name = "${var.project_name}-internal-lambda-sg"

  api_gw_lambdas = {
    for name, lambda in local.lambdas :
    name => lambda if !lookup(lambda, "is_internal", false) && !lookup(lambda, "is_cognito", false)
  }

  cognito_lambdas = {
    for name, lambda in local.lambdas :
    name => lambda if lookup(lambda, "is_cognito", false)
  }

  lambdas = {
    //--------------------------------------------
    //----------------EXPERIENCES-----------------
    //--------------------------------------------
    post_experiences = {
      entity      = "experiences"
      description = "Post experiences Lambda"
      runtime     = "python3.9"
      env_vars = {
        EXPERIENCES_TABLE_NAME = module.dynamodb["experiences"].table_name
      }
    },
    get_experiences = {
      entity      = "experiences"
      description = "Get experiences Lambda"
      runtime     = "python3.9"
      env_vars = {
        EXPERIENCES_TABLE_NAME = module.dynamodb["experiences"].table_name
      }
    },
    get_experience_by_id = {
      entity      = "experiences"
      description = "Get experience by ID Lambda"
      runtime     = "python3.9"
      env_vars = {
        EXPERIENCES_TABLE_NAME = module.dynamodb["experiences"].table_name
      }
    },
    put_experience_by_id = {
      entity      = "experiences"
      description = "Update experience by ID lambda"
      runtime     = "python3.9"
      env_vars = {
        EXPERIENCES_TABLE_NAME = module.dynamodb["experiences"].table_name
      }
    },
    delete_experience_by_id = {
      entity      = "experiences"
      description = "Delete experience by ID lambda"
      runtime     = "python3.9"
      env_vars = {
        EXPERIENCES_TABLE_NAME = module.dynamodb["experiences"].table_name
      }
    },
    get_experience_image_by_id = {
      entity      = "experiences"
      description = "Get experience image by ID Lambda"
      runtime     = "python3.9"
      env_vars = {
        BUCKET_NAME            = module.image_bucket.bucket_id
        EXPERIENCES_TABLE_NAME = module.dynamodb["experiences"].table_name
      }
    },
    put_experience_image_by_id = {
      entity      = "experiences"
      description = "Put experience image by ID Lambda"
      runtime     = "python3.9"
      env_vars = {
        BUCKET_NAME            = module.image_bucket.bucket_id
        EXPERIENCES_TABLE_NAME = module.dynamodb["experiences"].table_name
      }
    },
    //--------------------------------------------
    //------------------REVIEWS-------------------
    //--------------------------------------------
    post_reviews = {
      entity      = "reviews"
      description = "Post reviews Lambda"
      runtime     = "python3.9"
      env_vars = {
        REVIEWS_TABLE_NAME     = module.dynamodb["reviews"].table_name
        EXPERIENCES_TABLE_NAME = module.dynamodb["experiences"].table_name
        USERS_TABLE_NAME       = module.dynamodb["users"].table_name
        AGENTS_TABLE_NAME      = module.dynamodb["agents"].table_name
      }
    },
    get_reviews = {
      entity      = "reviews"
      description = "Get reviews Lambda"
      runtime     = "python3.9"
      env_vars = {
        REVIEWS_TABLE_NAME = module.dynamodb["reviews"].table_name
      }
    },
    get_review_by_id = {
      entity      = "reviews"
      description = "Get review by ID Lambda"
      runtime     = "python3.9"
      env_vars = {
        REVIEWS_TABLE_NAME = module.dynamodb["reviews"].table_name
      }
    },
    put_review_by_id = {
      entity      = "reviews"
      description = "Put review by ID Lambda"
      runtime     = "python3.9"
      env_vars = {
        REVIEWS_TABLE_NAME     = module.dynamodb["reviews"].table_name
        EXPERIENCES_TABLE_NAME = module.dynamodb["experiences"].table_name
        USERS_TABLE_NAME       = module.dynamodb["users"].table_name
        AGENTS_TABLE_NAME      = module.dynamodb["agents"].table_name
      }
    },
    delete_review_by_id = {
      entity      = "reviews"
      description = "Delete review by ID Lambda"
      runtime     = "python3.9"
      env_vars = {
        REVIEWS_TABLE_NAME     = module.dynamodb["reviews"].table_name
        EXPERIENCES_TABLE_NAME = module.dynamodb["experiences"].table_name
        USERS_TABLE_NAME       = module.dynamodb["users"].table_name
        AGENTS_TABLE_NAME      = module.dynamodb["agents"].table_name
      }
    },
    //--------------------------------------------
    //-----------------LOCATION-------------------
    //--------------------------------------------
    get_provinces = {
      entity      = "location"
      description = "Get provinces Lambda"
      runtime     = "python3.9"
      env_vars = {
        LOCATION_TABLE_NAME = module.dynamodb["location"].table_name
      }
    },
    get_cities_by_province = {
      entity      = "location"
      description = "Get cities by province Lambda"
      runtime     = "python3.9"
      env_vars = {
        LOCATION_TABLE_NAME = module.dynamodb["location"].table_name
      }
    },
    location_data_loader = {
      entity      = "location/loader"
      description = "Upload provinces and cities data Lambda"
      runtime     = "python3.9"
      env_vars = {
        LOCATION_TABLE_NAME = module.dynamodb["location"].table_name
        ITEMS_FILE          = "/var/task/items.json"
      }
      is_internal = true
      is_folder   = true
    }
    //--------------------------------------------
    //-------------------USERS--------------------
    //--------------------------------------------
    post_confirmation = {
      entity      = "users/cognito"
      description = "Cognito post confirmation of user Lambda"
      runtime     = "python3.9"
      env_vars = {
        USERS_TABLE_NAME = module.dynamodb["users"].table_name
      }
      is_internal = true
      is_cognito  = true
    }
    get_user_by_id = {
      entity      = "users"
      description = "Get user by ID Lambda"
      runtime     = "python3.9"
      env_vars = {
        USERS_TABLE_NAME = module.dynamodb["users"].table_name
      }
    },
    put_user_by_id = {
      entity      = "users"
      description = "Update user by ID lambda"
      runtime     = "python3.9"
      env_vars = {
        USERS_TABLE_NAME = module.dynamodb["users"].table_name
      }
    },
    get_user_image_by_id = {
      entity      = "users"
      description = "Get user image by ID Lambda"
      runtime     = "python3.9"
      env_vars = {
        BUCKET_NAME      = module.image_bucket.bucket_id
        USERS_TABLE_NAME = module.dynamodb["users"].table_name
      }
    },
    put_user_image_by_id = {
      entity      = "users"
      description = "Put user image by ID Lambda"
      runtime     = "python3.9"
      env_vars = {
        BUCKET_NAME      = module.image_bucket.bucket_id
        USERS_TABLE_NAME = module.dynamodb["users"].table_name
      }
    },
    get_user_experiences = {
      entity      = "users"
      description = "Get user experiences by ID Lambda"
      runtime     = "python3.9"
      env_vars = {
        USERS_TABLE_NAME       = module.dynamodb["users"].table_name
        EXPERIENCES_TABLE_NAME = module.dynamodb["experiences"].table_name
      }
    },
    get_user_favourites = {
      entity      = "users"
      description = "Get user favourites by ID Lambda"
      runtime     = "python3.9"
      env_vars = {
        USERS_TABLE_NAME       = module.dynamodb["users"].table_name
        EXPERIENCES_TABLE_NAME = module.dynamodb["experiences"].table_name
      }
    },
    put_user_favourite_by_id = {
      entity      = "users"
      description = "Put user experience favourite by ID Lambda"
      runtime     = "python3.9"
      env_vars = {
        USERS_TABLE_NAME       = module.dynamodb["users"].table_name
        EXPERIENCES_TABLE_NAME = module.dynamodb["experiences"].table_name
      }
    }
    //--------------------------------------------
    //-------------------TRIPS--------------------
    //--------------------------------------------
    post_trips = {
      entity      = "trips"
      description = "Post trips Lambda"
      runtime     = "python3.9"
      env_vars = {
        TRIPS_TABLE_NAME = module.dynamodb["trips"].table_name
      }
    },
    get_trips = {
      entity      = "trips"
      description = "Get user trips Lambda"
      runtime     = "python3.9"
      env_vars = {
        TRIPS_TABLE_NAME = module.dynamodb["trips"].table_name
      }
    },
    get_trip_by_id = {
      entity      = "trips"
      description = "Get trip by ID Lambda"
      runtime     = "python3.9"
      env_vars = {
        TRIPS_TABLE_NAME = module.dynamodb["trips"].table_name
      }
    },
    put_trip_by_id = {
      entity      = "trips"
      description = "Put trip by ID Lambda"
      runtime     = "python3.9"
      env_vars = {
        TRIPS_TABLE_NAME = module.dynamodb["trips"].table_name
      }
    },
    delete_trip_by_id = {
      entity      = "trips"
      description = "Delete trip by ID Lambda"
      runtime     = "python3.9"
      env_vars = {
        TRIPS_TABLE_NAME = module.dynamodb["trips"].table_name
      }
    },
    put_experience_in_trip_by_id = {
      entity      = "trips"
      description = "Add or remove experience from trip by ID Lambda"
      runtime     = "python3.9"
      env_vars = {
        TRIPS_TABLE_NAME = module.dynamodb["trips"].table_name
      }
    },
    //--------------------------------------------
    //-------------------AGENTS--------------------
    //--------------------------------------------
    post_agents = {
      entity      = "agents"
      description = "Post agents Lambda"
      runtime     = "python3.9"
      env_vars = {
        AGENTS_TABLE_NAME = module.dynamodb["agents"].table_name
      }
    },
    get_agents = {
      entity      = "agents"
      description = "Get agents Lambda"
      runtime     = "python3.9"
      env_vars = {
        AGENTS_TABLE_NAME = module.dynamodb["agents"].table_name
      }
    },
    get_agent_by_id = {
      entity      = "agents"
      description = "Get agent by ID Lambda"
      runtime     = "python3.9"
      env_vars = {
        AGENTS_TABLE_NAME = module.dynamodb["agents"].table_name
      }
    },
    put_agent_by_id = {
      entity      = "agents"
      description = "Update agent by ID lambda"
      runtime     = "python3.9"
      env_vars = {
        AGENTS_TABLE_NAME = module.dynamodb["agents"].table_name
      }
    },
    get_agent_image_by_id = {
      entity      = "agents"
      description = "Get agent image by ID Lambda"
      runtime     = "python3.9"
      env_vars = {
        BUCKET_NAME       = module.image_bucket.bucket_id
        AGENTS_TABLE_NAME = module.dynamodb["agents"].table_name
      }
    },
    put_agent_image_by_id = {
      entity      = "agents"
      description = "Put agent image by ID Lambda"
      runtime     = "python3.9"
      env_vars = {
        BUCKET_NAME       = module.image_bucket.bucket_id
        AGENTS_TABLE_NAME = module.dynamodb["agents"].table_name
      }
    },
    put_agent_recommendation = {
      entity      = "agents"
      description = "Add/remove agent recommendation Lambda"
      runtime     = "python3.9"
      env_vars = {
        AGENTS_TABLE_NAME      = module.dynamodb["agents"].table_name
        EXPERIENCES_TABLE_NAME = module.dynamodb["experiences"].table_name
      }
    },
    post_agent_articles = {
      entity      = "agents/articles"
      description = "Post agent articles Lambda"
      runtime     = "python3.9"
      env_vars = {
        AGENTS_TABLE_NAME   = module.dynamodb["agents"].table_name
        ARTICLES_TABLE_NAME = module.dynamodb["articles"].table_name
      }
    },
    get_agent_articles = {
      entity      = "agents/articles"
      description = "Get agent articles Lambda"
      runtime     = "python3.9"
      env_vars = {
        AGENTS_TABLE_NAME   = module.dynamodb["agents"].table_name
        ARTICLES_TABLE_NAME = module.dynamodb["articles"].table_name
      }
    },
    get_agent_article_by_id = {
      entity      = "agents/articles"
      description = "Get agent article by ID Lambda"
      runtime     = "python3.9"
      env_vars = {
        AGENTS_TABLE_NAME   = module.dynamodb["agents"].table_name
        ARTICLES_TABLE_NAME = module.dynamodb["articles"].table_name
      }
    },
    put_agent_article_by_id = {
      entity      = "agents/articles"
      description = "Put agent article by ID Lambda"
      runtime     = "python3.9"
      env_vars = {
        AGENTS_TABLE_NAME   = module.dynamodb["agents"].table_name
        ARTICLES_TABLE_NAME = module.dynamodb["articles"].table_name
      }
    },
    //--------------------------------------------
    //-------------------ADMIN--------------------
    //--------------------------------------------
    get_pending_experiences = {
      entity      = "admin"
      description = "Get pending experiences Lambda"
      runtime     = "python3.9"
      env_vars = {
        EXPERIENCES_TABLE_NAME = module.dynamodb["experiences"].table_name
      }
    },
    get_pending_experience_by_id = {
      entity      = "admin"
      description = "Get pending experience by ID Lambda"
      runtime     = "python3.9"
      env_vars = {
        EXPERIENCES_TABLE_NAME = module.dynamodb["experiences"].table_name
      }
    },
    put_pending_experience_by_id = {
      entity      = "admin"
      description = "Approve or deny pending experience by ID Lambda"
      runtime     = "python3.9"
      env_vars = {
        EXPERIENCES_TABLE_NAME = module.dynamodb["experiences"].table_name
      }
    },
    get_pending_agents = {
      entity      = "admin"
      description = "Get pending agents Lambda"
      runtime     = "python3.9"
      env_vars = {
        AGENTS_TABLE_NAME = module.dynamodb["agents"].table_name
      }
    },
    get_pending_agent_by_id = {
      entity      = "admin"
      description = "Get pending agent by ID Lambda"
      runtime     = "python3.9"
      env_vars = {
        AGENTS_TABLE_NAME = module.dynamodb["agents"].table_name
      }
    },
    put_pending_agent_by_id = {
      entity      = "admin"
      description = "Approve or deny pending agent by ID Lambda"
      runtime     = "python3.9"
      env_vars = {
        AGENTS_TABLE_NAME = module.dynamodb["agents"].table_name
      }
    },
  }
}
