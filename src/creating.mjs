import setText, { appendText } from "./results.mjs";


// resolve set the state to ==> Fullfilled 
export function timeout() {
    const wait = new Promise((resolve) => {
        setTimeout(() => {
            resolve("Timeout!");
        }, 1500);
    });

    wait.then(text => setText(text));
}

export function interval() {
    let counter = 0;
    const wait = new Promise((resolve) => {
        setInterval(() => {
            console.log('INTERVAL');
            resolve(`Timeout! ${++counter}`);
        }, 1500);
    });

    wait.then(text => setText(text))
        .finally(() => appendText(` -- Done ${counter}`));
    // Once a promise is been setteled, it's state woulden't update,
    // that's because the [resolve] method does nothing, the func still been called,
    // but the promise is setteled
}

export function clearIntervalChain() {
    let counter = 0;
    let interval;
    const wait = new Promise((resolve) => {
    interval = setInterval(() => {
        console.log('INTERVAL');
        resolve(`Timeout! ${++counter}`);
    }, 1500);
});

    wait.then(text => setText(text))
        .finally(() => clearInterval(interval));
}



export function xhr() {
    let request = new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", "http://localhost:3000/users/7");
        xhr.onload = ()=> {
            if(xhr.status === 200)
                resolve(xhr.responseText);
            else
                reject(xhr.status)
        };
        xhr.onerror = () => reject("Request Faliled");
        xhr.send();
    });
    request.then(result => setText(result))
        .catch(reason => setText(reason));
}

export function allPromises() {
    let categories = axios.get("http://localhost:3000/itemCategories");
    let statuses = axios.get("http://localhost:3000/orderStatuses");
    let userTypes = axios.get("http://localhost:3000/userTypes");
    let addressTypes = axios.get("http://localhost:3000/addressTypes");

    // fire all promises at once, and wait for all their responses to resolve
    Promise.all([categories, statuses, userTypes, addressTypes])
        .then(([cat, stat, type, address]) => {
            setText("");

            appendText(JSON.stringify(cat.data));
            appendText(JSON.stringify(stat.data));
            appendText(JSON.stringify(type.data));
            appendText(JSON.stringify(address.data));
        }).catch((reasons) => {
            setText(reasons);
        }
        );


}

export function allSettled() {
    let categories = axios.get("http://localhost:3000/itemCategories");
    let statuses = axios.get("http://localhost:3000/orderStatuses");
    let userTypes = axios.get("http://localhost:3000/userTypes");
    let addressTypes = axios.get("http://localhost:3000/addressTypes");

    // fire all promises at once, and return an object(no need for catch block):
    /*
       case1: { 
            status: "fulfilled",
            value; {...}
                }
       case2: { 
            status: "rejected",
            reason; {}
                }     
     */
    Promise.allSettled([categories, statuses, userTypes, addressTypes])
        .then((values) => {
            let results = values.map(v => {
                if(v.status == 'fulfilled') 
                    return `FULFILLED: ${JSON.stringify(v.value.data[0])} `;
                return `REJECTED: ${JSON.stringify(v.reason.message)} `;
            });
            setText(results);
        }).catch((reasons) => {
            setText(reasons);
        }
        );
}

// takes the response of the first resolved promise 
export function race() {
    let users = axios.get("http://localhost:3000/users");
    let backup = axios.get("http://localhost:3001/users");

    Promise.race([users, backup])
        .then(users => setText(JSON.stringify(users.data)))
        .catch(reason => setText(reason));
}
