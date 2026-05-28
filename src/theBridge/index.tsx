import { useState } from 'react';
import bridgeSettings from '../brdgeSettings/bridge.json';

// Helper function to add delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function theBridge(bridgeSettings: any, requestParams: any) {  
const connectionMethod = bridgeSettings?.connectionMethod;

//---- 6. validate request structure
if(bridgeSettings?.requestStructure && bridgeSettings?.requestStructure.length > 0)
{
  const validRequest:boolean = validateRequest(requestParams, bridgeSettings?.requestStructure);
  if(!validRequest)
  {
    console.log('Bridge Error: Invalid request structure. Expected fields are missing.');
    return;
  }
} 


//---- 7  callApi
let responseData:any;
if(connectionMethod === 'REST' )
{
  if(bridgeSettings?.connectionMethodType === 'GET') {    
    responseData = await bridgeRestCallGet(bridgeSettings, requestParams);
    if(!responseData && bridgeSettings?.retrySettings?.retry === 'active')    {
      console.log(`Bridge Info: Retrying GET API call. Attempt ${bridgeSettings?.retrySettings?.retryCount}`);
      let retryCount = 0;
      while(retryCount < bridgeSettings?.retrySettings?.retryCount && !responseData) {
        //console.log('bridgeRestCallGet retrying... Attempt:', retryCount + 1);        
        // Wait for bridgeSettings?.retrySettings?.retryDelay before making the call
        await new Promise(resolve => setTimeout(resolve, bridgeSettings?.retrySettings?.retryDelay));        
        responseData = await bridgeRestCallGet(bridgeSettings, requestParams);
        retryCount++;
      }
    }
  }
  else if(bridgeSettings?.connectionMethodType === 'POST') {
    responseData = await bridgeRestCallPost(bridgeSettings, requestParams);
    if(!responseData && bridgeSettings?.retrySettings?.retry === 'active')    {
      console.log(`Bridge Info: Retrying POST API call. Attempt ${bridgeSettings?.retrySettings?.retryCount}`);
      let retryCount = 0;
      while(retryCount < bridgeSettings?.retrySettings?.retryCount && !responseData) {
        //console.log('bridgeRestCallGet retrying... Attempt:', retryCount + 1);        
        // Wait for bridgeSettings?.retrySettings?.retryDelay before making the call
        await new Promise(resolve => setTimeout(resolve, bridgeSettings?.retrySettings?.retryDelay));        
        responseData = await bridgeRestCallGet(bridgeSettings, requestParams);
        retryCount++;
      }
    }
  }
  else if(bridgeSettings?.connectionMethodType === 'PUT') {
    responseData = await bridgeRestCallPut(bridgeSettings, requestParams);
  }
  else if(bridgeSettings?.connectionMethodType === 'PATCH') {
    responseData = await bridgeRestCallPatch(bridgeSettings, requestParams);
  }
  else if(bridgeSettings?.connectionMethodType === 'DELETE') {
    responseData = await bridgeRestCallDelete(bridgeSettings, requestParams);
  }
}
// ---- 8. validate response structure
let validResponse:boolean = true;

if(bridgeSettings?.connectionMethodType === 'GET' || bridgeSettings?.connectionMethodType === 'POST')
{
  validResponse = validateResponse(responseData, bridgeSettings?.responseStructure);
  if(!validResponse)
  {
    console.log('Bridge Error: Invalid response structure. Expected fields are missing.');
    return;
  }
  else
  {
    return responseData;
  }
}
else
{
  // For PUT, PATCH, DELETE - just check if responseData exists
  if(!responseData)
  {
    console.log('Bridge Error: No response data received.');
    return;
  }
}



}

// validateRequest //////////////////////////////////////////////////////////////////////////////////// 
function validateRequest(requestParams: any, expectedStructure: any): boolean {  

  // Check if requestParams exists
  if (!requestParams) { 
    console.log('Bridge Error: requestParams is null or undefined');
    return false;
  }

  // Check if expectedStructure is an array
  if (!Array.isArray(expectedStructure)) {
    console.log('Bridge Error: expectedStructure is not an array');
    return false;
  }

  // Check if requestParams is an object (not an array)
  if (Array.isArray(requestParams) || typeof requestParams !== 'object') {
    console.log('Bridge Error: requestParams should be an object, not an array');
    return false;
  }

  // Check if all expected fields exist in requestParams
  const missingFields: string[] = [];

  for (const field of expectedStructure) {
    if (!(field in requestParams)) {
      missingFields.push(field);
    }
  }

  if (missingFields.length > 0) {
    console.log(`Bridge Error: Missing fields in requestParams: ${missingFields.join(', ')}`);
    return false;
  }

  //console.log('Bridge Success: All required fields are present in requestParams');
  return true;
}

// validateResponse //////////////////////////////////////////////////////////////////////////////////// 
function validateResponse(responseData: any, expectedStructure: any): boolean {
  

  // Check if responseData exists
  if (!responseData) {
    console.log('Bridge Error: responseData is null or undefined');
    return false;
  }

  // Check if expectedStructure is an array
  if (!Array.isArray(expectedStructure)) {
    console.log('Bridge  Error: expectedStructure is not an array');
    return false;
  }

  // Check if responseData is an array of objects
  if (!Array.isArray(responseData)) {
    console.log('Bridge Error: responseData is not an array');
    return false;
  }

  // Check each object in the responseData array
  for (let i = 0; i < responseData.length; i++) {
    const row = responseData[i];
    const missingFields: string[] = [];

    for (const field of expectedStructure) {
      if (!(field in row)) {
        missingFields.push(field);
      }
    }

    if (missingFields.length > 0) {
      console.log(`Bridge Error: Row ${i} is missing fields: ${missingFields.join(', ')}`);
      return false;
    }
  }

  //console.log(`Bridge Success: All ${responseData.length} rows have all required fields`);
  return true;
}


// bridgeRestCall - GET //////////////////////////////////////////////////////////////////////////////////////////
async function bridgeRestCallGet(bridgeSettings: any, requestParams: any)
{
  // for Get Type
  if(bridgeSettings?.connectionMethodType === 'GET')
  {
    // Construct the URL with query parameters
    const url = new URL(bridgeSettings?.apiEndpoint);
    
    // Build query string from requestParams if not null
    if (requestParams && typeof requestParams === 'object') {
      Object.keys(requestParams).forEach(key => url.searchParams.append(key, requestParams[key]));
    }
    
    const requestOptions = {
      method: 'GET',
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
        return false;
        // Here you can add code to handle errors and implement retry logic if needed
      });     
    }

}

// bridgeRestCall - POST //////////////////////////////////////////////////////////////////////////////////////////
async function bridgeRestCallPost(bridgeSettings: any, requestParams: any)
{
  // for POST Type
  if(bridgeSettings?.connectionMethodType === 'POST')
  {
    const url = new URL(bridgeSettings?.apiEndpoint);
    
    const requestOptions = {
      method: 'POST',
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

// bridgeRestCall - PUT //////////////////////////////////////////////////////////////////////////////////////////
async function bridgeRestCallPut(bridgeSettings: any, requestParams: any)
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
async function bridgeRestCallPatch(bridgeSettings: any, requestParams: any)
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
async function bridgeRestCallDelete(bridgeSettings: any, requestParams: any)
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

//getBridgeSettings////////////////////////////////////////////////////////////////////////////////////////
export function getBridgeSettings(bridgeClientName: string)
{
  const bridgeObject:any = JSON.parse(JSON.stringify(bridgeSettings));  
  // Find and return the matching bridge client object
  const matchingBridge = bridgeObject.theBridgeClient.find((bridge: any) => bridge[bridgeClientName]);
  return matchingBridge ? matchingBridge[bridgeClientName] : null;
}

export default theBridge;
