

let requestParams = {};

/** 生成请求参数 */
requestParams.generateParams = function(data) {
    var param = ""
	if(typeof(data)==='object'){
		for(var key in data){
			if(data.hasOwnProperty(key)){
				if(data[key] !== '' && data[key] !== undefined){
					 param += key + "=" + data[key] + "&";
				}
			}
		}
		 param=param.substring(0,param.length-1)
    }
    return param ? `?${param}` : param;
}

export default requestParams;