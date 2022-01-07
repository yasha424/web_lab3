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

        return await result.json();
    }

    fetchMyQuery(operationsDoc) {
        return this.fetchGraphQL(operationsDoc, "MyQuery", {});
    }

    async startFetchMyQuery(operationsDoc) {
        const { errors, data } = await this.fetchMyQuery(operationsDoc);

        if (errors) {
            console.error(errors);
        }
        return data;
    }

    executeMyMutation(operationsDoc) {
        return this.fetchGraphQL(operationsDoc, "MyMutation", {});
    }

    async startExecuteMyMutation(operationsDoc) {
        const { errors, data } = await this.executeMyMutation(operationsDoc);

        if (errors) {
            console.error(errors);
        }
        return data;
    }
}

export default new RequestHelper();
