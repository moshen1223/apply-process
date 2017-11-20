const storage = {
    saveToStorage: function(key,value){
        window.localStorage[key] = value
    },
    getFromStorage: function(key){
        return window.localStorage[key]
    }
}

export default storage