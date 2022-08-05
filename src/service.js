// declare module service {
  
// }

const service = self.addEventListener('activate', async () => {
    // This will be called only once when the service worker is activated.
    console.log('service worker activate')
  })

// export default service;