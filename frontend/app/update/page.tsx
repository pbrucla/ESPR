'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
import styles from "../page.module.css";
import xstyle from "./page.module.css";
import publishstyles from "../publish/page.module.css";
import { Web3 } from 'web3';
import { contract_abi } from '../publish/abi';
import { package_abi } from './packAbi.js'

const back_url = "http://127.0.0.1:5000";

export default function Home(){
    const [updateVersion, setUpdateVersion] = React.useState(true);
    const [addCollab, setAddCollab] = React.useState(false);
    const [disable, setDisable] = React.useState(false);
    async function submitting(formData: FormData) {}
    function VersionForm() {
        return (
            <div className={publishstyles.publishbody}>
                <div className={styles.title}>
                    <h2>Updating a Package</h2>
                </div>
                    <form action={submitting}>
                        <div className={publishstyles.basictextcenter}>
                            <div>
                                <h2>Package Address</h2>
                                <p>Prefix with '0x'</p>
                                <input
                                    className={publishstyles.publishtextinput}
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
                                    className={publishstyles.publishtextinput}
                                    name="priv"
                                    id="priv"
                                    type="password"
                                    required
                                />
                            </div>
                            <div>
                                <h2>Update Description</h2>
                                <textarea
                                    className={publishstyles.publishdescinput}
                                    name="description"
                                    id="description"
                                    required
                                />
                            </div>
                            <div>
                                <h2>Update Dependencies </h2>
                                <p>Enter comma-separated list of the addresses of ALL dependencies</p>
                                {
                                    //consider changing this to a textarea field instead since addresses are kinda long
                                }
                                <input
                                    className={publishstyles.publishtextinput}
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
                            <button className={publishstyles.submitbutton} type="submit"> 
                                Update Package!
                            </button>
                        </div>
                    </form>
                </div>
        )
    }

    function CollaboratorForm() {
        return (
            <div className={publishstyles.publishbody}>
                <div className={styles.title}>
                    <h2>Adding a Collaborator</h2>
                </div>
                    <form action={submitting}>
                        <div className={publishstyles.basictextcenter}>
                            <div>
                                <h2>Package Address</h2>
                                <p>Prefix with '0x'</p>
                                <input
                                    className={publishstyles.publishtextinput}
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
                                    className={publishstyles.publishtextinput}
                                    name="priv"
                                    id="priv"
                                    type="password"
                                    required
                                />
                            </div>
                            <div>
                                <h2>Collaborator Address</h2>
                                <input
                                    className={publishstyles.publishtextinput}
                                    name="collab"
                                    id="collab"
                                    type="text"
                                    required
                                />
                            </div>
                            <br/>
                            <button className={publishstyles.submitbutton} type="submit"> 
                                Add Collaborator!
                            </button>
                        </div>
                    </form>
                </div>
        )
    }

    async function submitDisable(formData: FormData) {
        const web3 = new Web3('http://127.0.0.1:8545');
        try {
            const priv = formData.get("priv") as string;
            const addr = formData.get("address") as string;

            const pack_contract = new web3.eth.Contract(package_abi, addr);
            const acct = web3.eth.accounts.wallet.add(priv);
            const from_addr = acct[0].address;

            const receipt = await pack_contract.methods.disable().send({from: from_addr});
            console.log('success');
        } catch (error) {
            if (error instanceof Error){
                console.log(error.message);
            }
            return;
        }
    }

    function DisableForm() {
        return (
            <div className={publishstyles.publishbody}>
                <div className={styles.title}>
                    <h2>Disabling a Package</h2>
                </div>
                    <form action={submitDisable}>
                        <div className={publishstyles.basictextcenter}>
                            <div>
                                <h2>Package Address</h2>
                                <p>Prefix with '0x'</p>
                                <input
                                    className={publishstyles.publishtextinput}
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
                                    className={publishstyles.publishtextinput}
                                    name="priv"
                                    id="priv"
                                    type="password"
                                    required
                                />
                            </div>
                            <br/>
                            <button className={publishstyles.submitbutton} type="submit"> 
                                Disable Package!
                            </button>
                        </div>
                    </form>
                </div>
        )
    }

    return (
        <main>
            <div className={styles.title}>
                <h1>Update a Package</h1>
            </div>
            <div className={xstyle.buttongroup}>
                <button onClick={() => {setUpdateVersion(true); setAddCollab(false); setDisable(false);}}>Add Version</button>
                <button onClick={() => {setUpdateVersion(false); setAddCollab(true); setDisable(false);}}>Add Collaborator</button>
                <button onClick={() => {setUpdateVersion(false); setAddCollab(false); setDisable(true);}}>Disable Package</button>
            </div> 
            {updateVersion && <VersionForm/>}
            {addCollab && <CollaboratorForm/>}
            {disable && <DisableForm/>}
        </main>
    )
}