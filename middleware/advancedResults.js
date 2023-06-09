const advancedResults=(model,populate)=>async(req,res,next)=>{
    let query;
    //Create query strings
    let queryStr=JSON.stringify(req.query);
    console.log(queryStr);
    //Create operators ($gt,$gte,$lt,$lte,$in)
    queryStr=queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g,match=>`$${match}`);
    //Finding resource
    query=model.find(JSON.parse(queryStr)).populate(populate);
    //Select Fields
    if(req.query.select){
        const fields=req.query.select.split(',').join(' ');
        query=query.select(fields);
    }
    
    //Sort
    if(req.query.sort){
        const sortBy=req.query.sort.split(',').join(' ');
        query=query.sort(sortBy);
    }else{
        query=query.sort('-createdAt');
    }
    //Pagination
    const page=parseInt(req.query.page,10)||1;
    const limit=parseInt(req.query.limit,10)||25;
    const startIndex=(page-1)*limit;
    const endIndex=page*limit;  
    const total=await model.countDocuments();
    query=query.skip(startIndex).limit(limit);
    //Executing query

    //Pagination result
    const pagination={};
    if(endIndex<total){
        pagination.next={
            page:page+1,
            limit
        }
    }
    if(startIndex>0){
        pagination.prev={
            page:page-1,
            limit
        }
    }
    
    //Finding Resource
    console.log(queryStr);
        if(populate)
        {
            query=query.populate(populate);
        }
        const results=await query;

        res.advancedResults={
            success:true,
            count:results.length,
            pagination,
            data:results
        }
        next(); 
};
module.exports=advancedResults;