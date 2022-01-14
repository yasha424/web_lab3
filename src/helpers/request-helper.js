import { isDisplayed } from '../store';

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
        isDisplayed.set(true);
        try {
            const { errors, data } = await this.fetchGraphQL(operationsDoc, "MyMutation", {});
            if (errors) {
                console.error(errors);
                isDisplayed.set(false);
                throw errors[0].message;
            }
            return data;
        } catch (e) {
            console.error(e);
            throw e;
        } finally {
            isDisplayed.set(false);
        }
    }
}

export default new RequestHelper();
