import { bridgeTraceAndTrack } from './traceAndTrack';


  export async function restPost(bridgeName:string, bridgeSettings: any, requestParams: any, requestBody: any)
    {
      let responseData:any;
    //check call pririty
    if(bridgeSettings?.callPriority === 'High') {
      // Handle high-priority POST call
      responseData = await bridgeRestCallPost(bridgeName, bridgeSettings, requestParams, requestBody);
    }
    if(bridgeSettings?.callPriority === 'Medium') {
      // Handle medium-priority POST call
      await new Promise(resolve => setTimeout(resolve, 2000)); // Delay for 2 seconds before making the call
      responseData = await bridgeRestCallPost(bridgeName, bridgeSettings, requestParams, requestBody);
    }
    if(bridgeSettings?.callPriority === 'Low') {
      // Handle low-priority POST call
      await new Promise(resolve => setTimeout(resolve, 5000)); // Delay for 5 seconds before making the call
      responseData = await bridgeRestCallPost(bridgeName, bridgeSettings, requestParams, requestBody);
    }
        
    
    
    if(!responseData && bridgeSettings?.retrySettings?.retry === 'active')    {
      console.log(`Bridge Info: Retrying POST API call. Attempt ${bridgeSettings?.retrySettings?.retryCount}`);
      let retryCount = 0;
      while(retryCount < bridgeSettings?.retrySettings?.retryCount && !responseData) {
        //console.log('bridgeRestCallGet retrying... Attempt:', retryCount + 1);        
        // Wait for bridgeSettings?.retrySettings?.retryDelay before making the call
        await new Promise(resolve => setTimeout(resolve, bridgeSettings?.retrySettings?.retryDelay));        
        responseData = await bridgeRestCallGet( bridgeName, bridgeSettings, requestParams);
        retryCount++;
      }
    }
      return responseData;
  }
export async function restGet(bridgeName:string, bridgeSettings: any, requestParams: any)
{
let responseData:any;
if(bridgeSettings?.callPriority === 'High') {
      // Handle high-priority GET call
      responseData = await bridgeRestCallGet(bridgeName, bridgeSettings, requestParams);
    }
    if(bridgeSettings?.callPriority === 'Medium') {
      // Handle medium-priority GET call
      await new Promise(resolve => setTimeout(resolve, 2000)); // Delay for 2 seconds before making the call
      responseData = await bridgeRestCallGet(bridgeName, bridgeSettings, requestParams);
    }
    if(bridgeSettings?.callPriority === 'Low') {
      // Handle low-priority GET call
      await new Promise(resolve => setTimeout(resolve, 5000)); // Delay for 5 seconds before making the call
      responseData = await bridgeRestCallGet(bridgeName, bridgeSettings, requestParams);
    }
    if(!responseData && bridgeSettings?.retrySettings?.retry === 'active')    {
      console.log(`Bridge Info: Retrying GET API call. Attempt ${bridgeSettings?.retrySettings?.retryCount}`);
      let retryCount = 0;
      while(retryCount < bridgeSettings?.retrySettings?.retryCount && !responseData) {
        //console.log('bridgeRestCallGet retrying... Attempt:', retryCount + 1);        
        // Wait for bridgeSettings?.retrySettings?.retryDelay before making the call
        await new Promise(resolve => setTimeout(resolve, bridgeSettings?.retrySettings?.retryDelay));        
        responseData = await bridgeRestCallGet(bridgeName, bridgeSettings, requestParams);
        retryCount++;
      }
    }

    return responseData;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// bridgeRestCall - GET //////////////////////////////////////////////////////////////////////////////////////////
export async function bridgeRestCallGet(bridgeName: string, bridgeSettings: any, requestParams: any)
{
  // for Get Type
  if(bridgeSettings?.connectionMethodType === 'GET')
  {
    // Construct the URL with query parameters
    const url = new URL(bridgeSettings?.apiEndpoint);
    
    // Build query string from requestParams if not null
    if (requestParams && typeof requestParams === 'object') {
    
      Object.keys(requestParams).forEach(key => {
  if (bridgeSettings?.requestStructure?.includes(key)) {
    url.searchParams.append(key, requestParams[key]);
  }
});

    }
    
    const requestOptions = {
      method: 'GET',
      headers: bridgeSettings?.headers || {},
    };
    // Make the API call    
    try {
      const startTime = Math.round(performance.now()) ;
      const response = await fetch(url.toString(), requestOptions);
      
      // Log all response headers
      const headersObj: any = {};
      response.headers.forEach((value, key) => {
        headersObj[key] = value;
      });
      //console.log('Response Headers:', headersObj);
      const endTime = Math.round(performance.now());
      //console.log(`API Status: HTTP Status Code ${response.status} - ${response.statusText}`);
      await bridgeTraceAndTrack(bridgeName, 'Success', response.status, endTime - startTime, new Date(), JSON.stringify(requestParams), bridgeSettings?.traceAndTrack );
      // Check HTTP status code
      if (!response.ok) {
        console.error(`API Error: HTTP Status Code ${response.status} - ${response.statusText}`);
        return false;
      }
      
      const data = await response.json();
      return data;
    } catch (error: any) {
      
      console.error('Bridge API Network Error:', {
        message: error?.message,
        errorCode: error?.code,
        name: error?.name,
        fullError: error
      });
      await bridgeTraceAndTrack(bridgeName, 'Error', 0,0, new Date(), JSON.stringify(requestParams), bridgeSettings?.traceAndTrack );
      return false;
    }
  }

}

// bridgeRestCall - POST //////////////////////////////////////////////////////////////////////////////////////////
export async function bridgeRestCallPost(bridgeName: string, bridgeSettings: any, requestParams: any, requestBody: any)
{
  // for POST Type
  if(bridgeSettings?.connectionMethodType === 'POST')
  {
    const url = new URL(bridgeSettings?.apiEndpoint);
     Object.keys(requestParams).forEach(key => {
  if (bridgeSettings?.requestStructure?.includes(key)) {
    url.searchParams.append(key, requestParams[key]);
  }
});
const validRequestBody:any = requestBody ? Object.keys(requestBody).reduce((acc: any, key) => {
  if (bridgeSettings?.requestBody?.includes(key)) {
    acc[key] = requestBody[key];
  }
  return acc;
}, {})
: null;

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...bridgeSettings?.headers || {},
      },
      body: JSON.stringify(validRequestBody),
    };
    // Make the API call
     const startTime = performance.now();    
    return await fetch(url.toString(), requestOptions)
      .then(response => response.json())
      .then(async data => {
       // console.log('API Response:', data);
        const endTime = performance.now();
       await bridgeTraceAndTrack(bridgeName, 'Success', 200, endTime - startTime, new Date(), JSON.stringify(requestParams), bridgeSettings?.traceAndTrack );
        return data;
        // Here you can add code to validate the response structure if needed
      })
      .catch(async error => {
      console.error('Bridge API Network Error:', {
        message: error?.message,
        errorCode: error?.code,
        name: error?.name,
        fullError: error
      });
      await bridgeTraceAndTrack(bridgeName, 'Error', 0,0, new Date(), JSON.stringify(requestParams), bridgeSettings?.traceAndTrack );
      return false;
      
      });     
    }

}

// bridgeRestCall - PUT //////////////////////////////////////////////////////////////////////////////////////////
export async function bridgeRestCallPut(bridgeSettings: any, requestParams: any)
{
  // for PUT Type
  if(bridgeSettings?.connectionMethodType === 'PUT')
  {
    const url = new URL(bridgeSettings?.apiEndpoint);
    
    const requestOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...bridgeSettings?.headers || {},
      },
      body: JSON.stringify(requestParams),
    };
    // Make the API call    
    return await fetch(url.toString(), requestOptions)
      .then(response => response.json())
      .then(data => {
       // console.log('API Response:', data);
        return data;
        // Here you can add code to validate the response structure if needed
      })
      .catch(error => {
        console.error('API Error:', error);
        // Here you can add code to handle errors and implement retry logic if needed
      });     
    }

}

// bridgeRestCall - PATCH //////////////////////////////////////////////////////////////////////////////////////////
export async function bridgeRestCallPatch(bridgeSettings: any, requestParams: any)
{
  // for PATCH Type
  if(bridgeSettings?.connectionMethodType === 'PATCH')
  {
    const url = new URL(bridgeSettings?.apiEndpoint);
    
    const requestOptions = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...bridgeSettings?.headers || {},
      },
      body: JSON.stringify(requestParams),
    };
    // Make the API call    
    return await fetch(url.toString(), requestOptions)
      .then(response => response.json())
      .then(data => {
       // console.log('API Response:', data);
        return data;
        // Here you can add code to validate the response structure if needed
      })
      .catch(error => {
        console.error('API Error:', error);
        // Here you can add code to handle errors and implement retry logic if needed
      });     
    }

}

// bridgeRestCall - DELETE //////////////////////////////////////////////////////////////////////////////////////////
export async function bridgeRestCallDelete(bridgeSettings: any, requestParams: any)
{
  // for DELETE Type
  if(bridgeSettings?.connectionMethodType === 'DELETE')
  {
    const url = new URL(bridgeSettings?.apiEndpoint);
    
    // Build query string from requestParams if not null
    if (requestParams && typeof requestParams === 'object') {
      Object.keys(requestParams).forEach(key => url.searchParams.append(key, requestParams[key]));
    }
    
    const requestOptions = {
      method: 'DELETE',
      headers: bridgeSettings?.headers || {},
    };
    // Make the API call    
    return await fetch(url.toString(), requestOptions)
      .then(response => response.json())
      .then(data => {
       // console.log('API Response:', data);
        return data;
        // Here you can add code to validate the response structure if needed
      })
      .catch(error => {
        console.error('API Error:', error);
        // Here you can add code to handle errors and implement retry logic if needed
      });     
    }

}
