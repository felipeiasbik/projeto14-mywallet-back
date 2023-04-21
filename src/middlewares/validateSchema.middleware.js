export function validateSchema (schema){

    return (req, res, next) => {

        const validation = schema.validate(req.body, {aboutEarly: false});
    
        if (validation.error) {
            const errors = validation.error.details.map( err => err.message);
            return res.status(422).send(errors);
        }
    
        next();

    }
}