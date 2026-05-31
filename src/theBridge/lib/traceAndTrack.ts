// trace and track function ////////////////////////////////////////////////////////////////////////////////////
export async function bridgeTraceAndTrack(bridgeName: string, executionStatus: string, responseCode: number, executionTime: number, requestedOn: Date, requestParams: any, traceAndTrackSettings: any = null) {
  // Implement your logging or tracking logic here
  
 //console.log('Bridge Trace - Client:' + bridgeName + ' Execution Status: ' + executionStatus + ' Response Code: ' + responseCode + ' Execution Time: ' + executionTime + ' Requested On: ' + requestedOn + ' Request Params: ' + JSON.stringify(requestParams));

  //bridgeName  executionStatus  responseCode  executionTime  requestedOn requestParams
  
  console.log('traceAndTrackSettings:', traceAndTrackSettings);
  if (traceAndTrackSettings?.enabled) {
    if (traceAndTrackSettings?.logToFile) {
      const logData = {
        bridgeName: bridgeName || "Unknown Bridge",
        executionStatus: executionStatus || "FAILED",
        responseCode: responseCode || 0,
        executionTime: executionTime || 0,
        requestedOn: requestedOn ? requestedOn.toISOString() : new Date().toISOString(),
        requestParams: requestParams
      };
      
      const existingLog = localStorage.getItem(bridgeName + '_logs');
      const logs = existingLog ? JSON.parse(existingLog) : [];
      logs.push(logData);
      localStorage.setItem(bridgeName + '_logs', JSON.stringify(logs));    
      const cuttrentLog = localStorage.getItem(bridgeName + '_logs');
      console.log('Current Logs for ' + bridgeName + ':', cuttrentLog);
    }
  }
}
