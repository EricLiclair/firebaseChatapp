import React from 'react'

export default function Container({ children, background = "#fff", alignItems = "flex-start", justifyContent = "flex-start", ...rest }) {
    return (
        <div style={{ height: "100%", width: "100%", display: "flex", alignItems: alignItems, justifyContent: justifyContent, background: background }} {...rest}>
            <div style={{ height: "100%", width: "100%" }}>
                {children}
            </div>
        </div>
    )
}
