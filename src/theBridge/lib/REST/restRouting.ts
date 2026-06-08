import { bridgeCallPriority, bridgeCallRetry } from '../callPriorityRetry';
import {validateResponse } from '../validateData';
import { bridgeTraceAndTrack } from '../traceAndTrack';
  export async function restSwitchingRouting(bridgeName:string, bridgeSettings: any,restType:string, requestParams: any, requestBody: any)
    {
      let responseData:any;
      responseData = await bridgeCallPriority(bridgeName, bridgeSettings, restType, requestParams, requestBody);    
      if(!responseData && bridgeSettings?.retrySettings?.retry === 'active')    {
        responseData = await bridgeCallRetry(bridgeName, bridgeSettings, restType, requestParams, requestBody);
        }
      //validate response structure after receiving the response ////////////////////////////////////////////////////////////////////////////////////
let validResponse:boolean = true;
if((bridgeSettings?.connectionMethodType === 'GET' || bridgeSettings?.connectionMethodType === 'POST') && 
    (bridgeSettings?.responseType?.toLowerCase() === 'application/json') && bridgeSettings?.validateResponse === true)
{
  validResponse = validateResponse(responseData, bridgeSettings?.responseStructure);
  if(!validResponse)
  {
    console.log('Bridge Error: Invalid response structure. Expected fields are missing.');
    await bridgeTraceAndTrack(bridgeName, 'validateResponseError', 0,0, new Date(), JSON.stringify(requestParams), bridgeSettings?.traceAndTrack );
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
    await bridgeTraceAndTrack(bridgeName, 'Error', 0,0, new Date(), JSON.stringify(requestParams), bridgeSettings?.traceAndTrack );
    return;
  }
}
  }
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
