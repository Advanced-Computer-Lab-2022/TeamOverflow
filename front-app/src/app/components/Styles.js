export const main_button = {
    color: "var(--primaryColor)",
    bgcolor: "var(--secColor)",
    ":hover": {
        color: "var(--secColor)",
        bgcolor: "var(--terColor)"
    },
    ":disabled": {
        color: "var(--mainWhite)",
        bgcolor: "gray"
    }
}

export const card_style = { 
    minWidth: "40vw",
    padding: 2, 
    marginX: "30vw", 
    marginY: 2, 
    ":hover": { 
        "transition-duration": "1s",
        "box-shadow": "0px 10px 5px 0px rgba(231,129,132,0.75)",
        "-webkit-box-shadow": "0px 10px 5px 0px rgba(231,129,132,0.75)",
        "-moz-box-shadow": "0px 10px 5px 0px rgba(231,129,132,0.75)"
    } 
}

export const centered_flex_box = {
    display: "flex",
    alignItems:"center",
    justifyContent:"center"
}