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
        const { errors, data } = await this.fetchGraphQL(operationsDoc, "MyMutation", {});

        if (errors) {
            console.error(errors);
            is_displayed.set(false);
            throw errors[0].message;
        }
        isDisplayed.set(false);
        return data;
    }
}

export default new RequestHelper();
