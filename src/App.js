import React, {useEffect, useState} from "react";
import axiosInstance from "./axiosInstance";

function App() {

    const [result, setResult] = useState();
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentImg, setCurrentImg] = useState("");

    const processOcr = (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.target);
        axiosInstance.postForm('http://localhost:8090/api/crud/image-analysis/upload', {
            file: formData.get('file')
        }).then((res) => {
            setResult(JSON.stringify(res.data, undefined, 2));
            setText((res.data.text || []).map((v) => v.content).join("\n"));
        })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div className="flex flex-col items-center justify-center w-full min-h-screen gap-2 p-4">
            <form className="flex flex-col items-center justify-center w-full gap-2" onSubmit={processOcr}
                  encType={'multipart/form-data'}>
                <img src={currentImg}/>
                <input
                    name={'file'}
                    type={'file'}
                    required
                    multiple={false}
                    accept="image/png, image/jpg, image/jpeg"
                    onChange={(e) => {
                        setCurrentImg(URL.createObjectURL(e.target.files[0]));
                    }}
                />
                <button className={'p-2 text-center bg-blue-400 text-white'}>{loading ? 'Processing...' : 'Process'}</button>
            </form>
            <h4 className={'text-lg font-bold'}>{text}</h4>
            <div className={'relative border rounded-lg w-full'}>
                {loading ? <div className={'absolute left-1/2 top-1/2'}>
                    <p className={'w-full font-bold text-center'}>Processing...</p>
                </div> : <pre>
                        {result}
                </pre>}
            </div>
        </div>
    );
}

export default App;
