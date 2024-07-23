'use client'

import React from 'react';
import styles from "../page.module.css";
import { Web3 } from 'web3';
import { contract_abi } from './abi.js';
const back_url = "http://127.0.0.1:5000";


export default function Home(){
    async function submitting(formData: FormData) {
        const priv = formData.get("priv") as string;
        const name = formData.get('name');
        const version = formData.get('initial_version');
        const desc = formData.get('description');
        const raw_deps = formData.get('deps') as string;
        const dep_arr = raw_deps.split(',');
        //web3.js stuff
        const web3 = new Web3('http://127.0.0.1:8545');

        try {
            const addr = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
            const pacman_contract = new web3.eth.Contract(contract_abi, addr);
            const account = web3.eth.accounts.wallet.add(priv);
            const from_addr = account[0].address;
            const pack_addr = await pacman_contract.methods.create_package(name, dep_arr).send({from: from_addr});
        } catch(error) {
        }
        try {
            const res = await fetch(
                `${back_url}/publish_package_sample`,
                {
                    method: 'POST',
                    body: formData,
                },
            );
        } catch (error) {
            if (error instanceof Error) {
                console.error(error.message);
            }
        }
    }
    return (
        <main>
            <div className={styles.title}>
                <h1>Publish a Package!</h1>
            </div>
            <div className={styles.publishbody}>
                <form action={submitting}>
                    <div className={styles.basictextcenter}>
                        <div>
                            <h2>Package Name</h2>
                            <input
                                className={styles.publishtextinput}
                                name="name"
                                id="name"
                                type="text"
                                maxLength={40}
                            />
                        </div>
                        <div>
                            <h2>Version Number</h2>
                            <input
                                className={styles.publishtextinput}
                                name="initial_version"
                                id="initial_version"
                                type="text"
                            />
                        </div>
                        <div>
                            <h2>Private Key</h2>
                            <p>Note: we do not store or send your private key over the web</p>
                            <input
                                className={styles.publishtextinput}
                                name="priv"
                                id="priv"
                                type="text"
                            />
                        </div>
                        <div>
                            <h2>Package Description</h2>
                            <input
                                className={styles.publishtextinput}
                                name="description"
                                id="description"
                                type="text"
                            />
                        </div>
                        <div>
                            <h2>Package Dependencies </h2>
                            <p>Enter comma-separated list of dependency names</p>
                            <input
                                className={styles.publishtextinput}
                                name="deps"
                                id="deps"
                                type="text"
                            />
                        </div>
                        <button className={styles.submitbutton} type="submit">
                            Publish Package!
                        </button>
                    </div>
                </form>
            </div>
        </main>
    )
}