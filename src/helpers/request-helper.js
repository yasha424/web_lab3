class RequestHelper {
    URL = another_uri;

    async fetchGraphQL(operationsDoc, operationName, variables) {
        const result = await fetch(this.URL, {
            method: "POST",
            body: JSON.stringify({
                query: operationsDoc,
                variables: variables,
                operationName: operationName,
            }),
        });

        return result.json();
    }

    async startExecuteMyMutation(operationsDoc) {
        const { errors, data } = await this.fetchGraphQL(operationsDoc, "MyMutation", {});

        if (errors) {
            console.error(errors);
            throw errors[0].message;
        }
        return data;
    }
}

export default new RequestHelper();
