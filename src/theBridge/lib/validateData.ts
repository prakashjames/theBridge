// validateRequest //////////////////////////////////////////////////////////////////////////////////// 
export function validateRequest(requestParams: any, expectedStructure: any): boolean {  

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
export function validateResponse(responseData: any, expectedStructure: any): boolean {
  

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
