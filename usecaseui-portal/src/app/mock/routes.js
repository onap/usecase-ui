// proxy routers setting
module.exports =
    {
        // "/articles/:user": "/articles?user=:user",
        // "/:resource/:id/show": "/:resource/:id",

        "/api/*": "/$1",
        "/*/*": "/$1_$2",
        "/*/*/*": "/$1_$2_$3",
        "/*/*/*/*": "/$1_$2_$3_$4",

    }
