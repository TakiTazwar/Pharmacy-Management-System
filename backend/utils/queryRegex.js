const queryFetchCustomer=(query)=>
{
    const name = query.name;
    const nameRegex = name?new RegExp(name, 'i'):/.*/;
    const category=query.category;
    const categoryRegex = category?new RegExp(category, 'i'):/.*/;
    const country=query.country;
    const countryRegex = country?new RegExp(country, 'i'):/.*/;

    const priceLow = query.pricelow;
    const priceHigh = query.pricehigh;
    let priceRegex;
    if(priceLow && priceHigh)
    {
        priceRegex={$gte:priceLow,$lte:priceHigh};
        //console.log("working");
    }
    else
    {
        if(priceLow)
        {
            priceRegex={$gte:priceLow};
        }
        else if(priceHigh)
        {
            priceRegex={$lte:priceHigh};
        }
        else
        {
            priceRegex={$gte:0};
        }
    }

    const searchRegex={name:nameRegex,category:categoryRegex,country:countryRegex,price:priceRegex};
    return searchRegex;
}

const queryFetchDelivery=(query)=>
{
    const address = query.address;
    const addressRegex = address?new RegExp(address, 'i'):/.*/;
    
    const searchRegex={address:addressRegex};
    return searchRegex;
}


module.exports={queryFetchCustomer,queryFetchDelivery};