'use client'

import React from 'react';
import styles from "./page.module.css";
import { Web3 } from 'web3';
import { contract_abi } from './abi.js';
const back_url = "http://127.0.0.1:5000";



export default function Home(){
    const [publish, setPublish] = React.useState(false);
    const [stinky, setStinky] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [uploading, setUploading] = React.useState(false);
    const [depAddr, setDepAddr] = React.useState('');
    function UploadPack(){
        async function submitting(formData: FormData) {
            setUploading(true);


            const priv = formData.get("priv") as string;
            formData.delete("priv");
            const name = formData.get('name');
            const desc = formData.get('description') as string;
            const raw_deps = formData.get('deps') as string;
            const dep_arr = raw_deps.split(',');
            //web3.js stuff
            const web3 = new Web3('http://127.0.0.1:8545');
            try {
                const res = await fetch(`${back_url}/contract_address`);
                const json = await res.json();
                const addr = json['address'];
                const pacman_contract = new web3.eth.Contract(contract_abi, addr);
                const account = web3.eth.accounts.wallet.add(priv);
                const from_addr = account[0].address;

                const second_res = await fetch(
                    `${back_url}/upload_package`,
                    {
                        method: 'POST',
                        body: formData,
                    },
                );

                const second_text = await second_res.text();

                const deployed = await pacman_contract.methods.create_package(name, dep_arr, desc, second_text).call({from: from_addr}).then(function(result){let temp = result + ''; setDepAddr(temp)});
                const receipt = await pacman_contract.methods.create_package(name, dep_arr, desc, second_text).send({from: from_addr});
                if(stinky) setStinky(false);
                setSuccess(true);
            } catch(error) {
                if (error instanceof Error){
                    console.error(error.message);
                }
                setStinky(true);
                setUploading(false);
                return;
            }
        }
        return (
            <div>
                <div className={styles.publishbody}>
                    <form action={submitting}>
                        <div className={styles.basictextcenter}>
                        {stinky && <div><p className={styles.errortext}>There was an error uploading your package.</p><br/></div>}
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
                                    name="file"
                                    id="file"
                                    type="file"
                                    multiple={true}
                                    required
                                />
                            </div>
                            <button className={uploading ? styles.uploadingbutton : styles.submitbutton} type="submit">
                                {uploading ? "Uploading!" : "Submit Package!"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
    return (
        <main>
            {!success && (<div>
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
                    <li>You&#39;re good to go!</li>
                </ul>
                <br/>
                <button className={styles.submitbutton} onClick={() => {setPublish(!publish)}}>Get Started!</button>
            </div>
            </div>)}
            {publish && !success && (<UploadPack/>)}
            {success && (
                <div className={styles.basictextcenter}>
                    <h1>
                        Your Package Has Been Successfully Published!
                    </h1>
                    <br/>
                    <p>
                        Your package has been deployed to the following address: <span className={styles.addresstext}>
                            {depAddr}
                        </span>
                    </p>
                    <br/>
                    <p>
                        Please save this address as this is the identifier for your package.
                    </p>
                </div>
            )}
        </main>
    )
}