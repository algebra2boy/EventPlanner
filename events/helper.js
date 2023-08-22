export const checkValidParameter = (data) => {
    const requiredParams = [
        { key: 'eventName', error: 'The request is missing event name' },
        { key: 'startDateString', error: 'The request is missing startDateString' },
        { key: 'endDateString', error: 'The request is missing endDateString' },
        { key: 'imageUrl', error: 'The request is missing image url' },
        { key: 'locationName', error: 'The request is missing location name' },
        { key: 'locationDetails', error: 'The request is missing location details' },
    ];

    // check if any parameter is missing
    for (const param of requiredParams) {
        if (!data[param.key]) {
            return param.error;
        }
    }

    // check if the image url's postfix is jpg
    if (!data.imageUrl.endsWith(".jpg")) {
        return "The image url post fix is not jpg"
    }

    return "Ok";
};
