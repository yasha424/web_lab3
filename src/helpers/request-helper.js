class RequestHelper {
    const URL = 'https://driven-panda-75.hasura.app/v1/graphql';

    async fetchGraphQL(operationsDoc, operationName, variables) {
        const result = await fetch(this.URL, {
            method: 'POST',
            body: JSON.stringify({
                query: operationsDoc,
                variables: variables,
                operationName: operationName,
            }),
        })

        return await result.json()
    }

    fetchMyQuery(operationsDoc) {
        return this.fetchGraphQL(operationsDoc, 'MyQuery', {})
    }

    async startFetchMyQuery(operationsDoc) {
        const { errors, data } = await this.fetchMyQuery(operationsDoc)

        if (errors) {
            // handle those errors like a pro
            console.error(errors)
        }

        // do something great with this precious data
        // console.log(data);
        return data
    }

    executeMyMutation(operationsDoc) {
        return this.fetchGraphQL(operationsDoc, 'MyMutation', {})
    }

    async startExecuteMyMutation(operationsDoc) {
        const { errors, data } = await this.executeMyMutation(operationsDoc)

        if (errors) {
            // handle those errors like a pro
            console.error(errors)
        }

        // do something great with this precious data
        // console.log(data);
        return data
    }
}

export default new RequestHelper()
