
const middlewares = {
    should_exist: (values) => {
        
        return async (req, res, next) => {
            try {
                for(let val of values){
                    if(!req.body.hasOwnProperty(val) || req.body.val == ''){
                        next({
                            status: 400,
                            error: `Property '${val}' does not exist or empty in request body`,
                        });
                        return;
                    }
                }
                next();
            } catch (error) {
                console.error(error);
                next({
                    status: 500,
                    error: `Internal server error`,
                });
            }
        }
    },

    validate_username: async (req, res, next) => {
        try {
            let username = String(req.body.username).trim();
            const len = username.length;
            if(len < 3 || len > 32){
                next({
                    status: 400,
                    error: `Length of username can be between 3 to 32`,
                });
                return;
            }

            const rxp = new RegExp("^[0-9A-Za-z_-]+$");

            if(!rxp.test(username)){
                next({
                    status: 400,
                    error: `Username can only consist of Alphanumeric characters, underscores and hyphens`,
                });
                return;
            }

            next();
            
        } catch (error) {
            console.error(error);
            next({
                status: 500,
                error: `Internal server error`,
            });
        }
    }

}

export default middlewares;