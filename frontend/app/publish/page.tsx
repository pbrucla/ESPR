'use client'

import React from 'react';
import styles from "../page.module.css";
const back_url = "http://127.0.0.1:5000";

export default function Home(){
    const [name, setName] = React.useState('');
    const [vers, setVers] = React.useState('');
    const [priv, setPriv] = React.useState('');
    const [pub, setPub] = React.useState('');
    
    const submitting = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    }
    return (
        <main>
            <div className={styles.title}>
                <h1>Publish a Package!</h1>
            </div>
            <div className={styles.center}>
                <form onSubmit={submitting}>
                    <div>
                        <div>
                            <h3>Package Name</h3>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                maxLength={40}
                            />
                        </div>
                        <div>
                            <h3>Version Number</h3>
                            <input
                                id="version"
                                type="text"
                                value={vers}
                                onChange={(e) => setVers(e.target.value)}
                            />
                        </div>
                        <div>
                            <h3>Private Key</h3>
                            <p>Note: we do not store or send your private key over the web</p>
                            <input
                                id="priv"
                                type="text"
                                value={priv}
                                onChange={(e) => setPriv(e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <button type="submit">
                            Publish Package!
                        </button>
                    </div>
                </form>
            </div>
        </main>
    )
}