// urlB64ToUint8Array is a magic function that will encode the base64 public key
// to Array buffer which is needed by the subscription option
const urlB64ToUint8Array = base64String => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')
    const rawData = atob(base64)
    const outputArray = new Uint8Array(rawData.length)
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
}

const saveSubscription = async subscription => {
    const SERVER_URL = 'http://localhost:9014/save-subscription';
    const response = await fetch(SERVER_URL, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription)
    })
    return response.json()
}


self.addEventListener('activate', async () => {
    console.log('service worker激活了')
    try{
        // chrome里面 applicationServerKey 和 userVisibleOnly 都是必填项
        const options = {
            // applicationServerKey: urlB64ToUint8Array('BDgN6W7rIH0LQJ6KCQ03To8VSyPMfHXCAzKZ08CRwVtQdkJJLppplkACC3zd_gQIwP1ZvW4PtfeF0eim-WQBfoM'),
            // userVisibleOnly: true
        };
        const subscription = await self.registration.pushManager.subscribe(options)
        console.log(subscription)
        const response = await saveSubscription(subscription);
        console.log(response)
    }catch(err){
        console.log(err)
    }
})

const showLocalNotification = (title, body, swRegistration) => {
    const options = {
        body
    }
    swRegistration.showNotification(title, options)
}

self.addEventListener('push', e => {
    if(e.data){
        console.log('push event!', e.data.text());
        showLocalNotification('Yolo', e.data.text(), self.registration);
    }else{
        console.log('push event but no data');
    }
})

