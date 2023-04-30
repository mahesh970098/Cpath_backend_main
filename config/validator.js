
const Joi = require('joi');

exports.startupcontactus = {
    body:
    {
        entity_type: Joi.required(),
        entity_name: Joi.required(),
        user_name: Joi.required(),
        email_id: Joi.required(),
        location_state: Joi.required(),
        location_city: Joi.required(),
        query_type: Joi.required(),
        message: Joi.required(),
    }
}
exports.postgrievence = {
    body:
    {
        entity_type: Joi.number().min(1).required(),
        name_of_entity: Joi.string().required(),
        name_of_user: Joi.string().min(3).required(),
        email_id: Joi.string().required(),
        contact_number: Joi.number().required(),
        state_id: Joi.number().min(1).required(),
        city_id: Joi.number().min(1).required(),
        grievance_type: Joi.number().min(1).required(),
        grievance_against: Joi.number().min(1).required(),
        grievance_description: Joi.string().min(1).max(1000).required(),
    }
}
exports.postgrievancecomments = {
    body:
    {
        grievance_id: Joi.number().min(1).required(),
        comments: Joi.string().required() 
    }
}


// #############################SECRETARIAT REAPPLY#################################
exports.reapply_sec_store = {
    body:
    {
        meeting_date:Joi.string().regex(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required(),
        meeting_from_time:Joi.required(),
        meeting_to_time:Joi.required(),
        link: Joi.string().required(),
        comment:Joi.string().required(),
        meeting_type:Joi.number().required(),
        incubator_application_ids:Joi.array().items(Joi.number()).required() 
    }
}

