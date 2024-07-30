'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
import styles from "../page.module.css";
import { Web3 } from 'web3';
import { contract_abi } from '../publish/abi';

const back_url = "http://127.0.0.1:5000";

export default function Home(){
    async function submitting(formData: FormData) {}
    return (
        <main>
            <div className={styles.title}>
                <h1>Update a Package</h1>
            </div>
            <div className={styles.publishbody}>
                    <form action={submitting}>
                        <div className={styles.basictextcenter}>
                            <div>
                                <h2>Package Address</h2>
                                <p>Prefix with '0x'</p>
                                <input
                                    className={styles.publishtextinput}
                                    name="address"
                                    id="address"
                                    type="text"
                                    maxLength={42}
                                    minLength={42}
                                    required
                                />
                            </div>
                            <div>
                                <h2>Private Key</h2>
                                <p>Note: we do not store or send your private key over the web</p>
                                <input
                                    className={styles.publishtextinput}
                                    name="priv"
                                    id="priv"
                                    type="password"
                                    required
                                />
                            </div>
                            <div>
                                <h2>Update Description</h2>
                                <textarea
                                    className={styles.publishdescinput}
                                    name="description"
                                    id="description"
                                    required
                                />
                            </div>
                            <div>
                                <h2>Update Dependencies </h2>
                                <p>Enter comma-separated list of dependency names</p>
                                <input
                                    className={styles.publishtextinput}
                                    name="deps"
                                    id="deps"
                                    type="text"
                                    required
                                />
                            </div>
                            <div>
                                <h2>Files</h2>
                                <p>Please input all files necessary for the package.</p>
                                <br/>
                                <input 
                                    name="files"
                                    id="files"
                                    type="file"
                                    multiple={true}
                                    required
                                />
                                <br/>
                            </div>
                            <br/>
                            <button className={styles.submitbutton} type="submit">
                                Publish Package!
                            </button>
                        </div>
                    </form>
                </div>
        </main>
    )
}