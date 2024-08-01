'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
import styles from "./page.module.css";
import { Web3 } from 'web3';
import { contract_abi } from './abi.js';
const back_url = "http://127.0.0.1:5000";

function UploadPack(){
    const router = useRouter();
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
            const pack_addr = await pacman_contract.methods.create_package(name, dep_arr, desc, ).send({from: from_addr});
        } catch(error) {
            if (error instanceof Error){
                console.error(error.message);
            }
            return;
        }
        try {
            const res = await fetch(
                `${back_url}/publish_package_sample`,
                {
                    method: 'POST',
                    body: formData,
                },
            );
            if (res.ok){
                router.push('/publish/success');
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error(error.message);
            }
        }
    }
    return (
        <div>
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
                                required
                            />
                        </div>
                        <div>
                            <h2>Version Number</h2>
                            <input
                                className={styles.publishtextinput}
                                name="initial_version"
                                id="initial_version"
                                type="text"
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
                            <h2>Package Description</h2>
                            <textarea
                                className={styles.publishdescinput}
                                name="description"
                                id="description"
                                required
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
                                required
                            />
                        </div>
                        <div>
                            <h2>Files</h2>
                            <input 
                                name="files"
                                id="files"
                                type="file"
                                multiple={true}
                                required
                            />
                        </div>
                        <button className={styles.submitbutton} type="submit">
                            Publish Package!
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default function Home(){
    const [publish, setPublish] = React.useState(false);
    return (
        <main>
            <div className={styles.title}>
                <h1>Publish a Package!</h1>
            </div>
            <div className={styles.basictextcenter}>
                <h2>How to Publish a Package:</h2>
                <br/>
                <ul>
                    <li>Provide a package name, version, and description
                    </li>
                    <li>Version should be of the form x.y.z, for nonnegative integer x,y,z</li>
                    <li>Provide your private key; this is not stored in any way, nor is it sent over the web</li>
                    <li>Select the relevant files for your package</li>
                    <li>You're good to go!</li>
                </ul>
                <br/>
                <button className={styles.submitbutton} onClick={() => {setPublish(!publish)}}>Get Started!</button>
            </div>
            {publish && (<UploadPack/>)}
        </main>
    )
}