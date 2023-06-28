import React, { useState, useEffect } from "react";
import Link from "next/link";
import fetch from "isomorphic-unfetch";
import { useRouter } from "next/router";
import { useRef } from "react";
import { Button, Form, Loader } from "semantic-ui-react";
import { v4 as uuidv4 } from "uuid";
import { AlertDanger } from "../../components/Alert";

const newVisitor = () => {
  const [showAlert, setShowAlert] = useState(false);
  const fileInputRef = useRef(null);
  const [itemList, setItemList] = useState([]);
  const [fileName, setFileName] = useState(null);
  const [currentCount, setCurrentCount] = useState(0);
  const [conflictCount, setConflictCount] = useState(0);
  const [form, setForm] = useState({
    file: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const router = useRouter();

  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  useEffect(() => {
    if (isSubmitting) {
      if (Object.keys(errors).length === 0) {
        startUploading();
      } else {
        setIsSubmitting(false);
      }
    }
  }, [errors]);

  const createVisitor = async (item) => {
    try {
      const res = await fetch("/api/visitor", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },

        body: JSON.stringify({ email: item.email }),
      });
      let status = "ready";
      if (res.status === 409) {
        setShowAlert(true);
        setIsSubmitting(false);
        status = "conflict";
        setConflictCount((prev) => prev + 1);
        showAlert(true);
      } else if (res.status === 201) {
        status = "done";
      }

      setItemList((prevList) =>
        prevList.map((prevItem) => {
          if (prevItem.email === item.email) {
            return { ...prevItem, status: status };
          }
          return prevItem;
        })
      );
      return res;
    } catch (err) {
      console.error(err.message);
      return err;
    }
  };
  const startUploading = async () => {
    for (const item of itemList) {
      try {
        const res = await createVisitor(item);
        setCurrentCount((prev) => prev + 1);
      } catch (err) {
        console.error(err.message);
      }
    }
    router.push("/clients");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let errs = validate();
    setErrors(errs);
    setIsSubmitting(true);
  };
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    let err = {};
    if (!fileName) {
      err.file = "file is not valid";
    }
    return err;
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();

      reader.onload = (e) => {
        const content = e.target.result;

        const lines = content.split("\n");
        setItemList(
          lines.map((line) => {
            return { email: line, status: "ready" };
          })
        );
      };

      reader.readAsText(file);
    }
  };

  return (
    <div className="bg-gray-200 h-screen">
      {showAlert && (
        <AlertDanger message={`${conflictCount} Client conflicted!`} />
      )}

      <div className=" flex flex-col justify-center max-w-screen-md mx-auto py-8 antialiased px-10 ">
        <div className="flex justify-between items-center my-8 ">
          <h1 className="text-3xl font-medium">Create Clients</h1>
          <Link href="/clients">
            <a className=" text-md text-gray-700 font-medium hover:text-gray-900 ">
              Back
            </a>
          </Link>
        </div>
        {isSubmitting ? (
          <Loader active inline="centered" />
        ) : (
          <Form onSubmit={handleSubmit}>
            <Form.Input
              error={
                errors.file
                  ? { content: "File is not valid", pointing: "below" }
                  : null
              }
              type="file"
              ref={fileInputRef}
              label="file"
              name="file"
              placeholder="file"
              onChange={handleFileChange}
            />
            <div className="flex justify-between">
              <Button type="submit">Start uploading</Button>
            </div>
          </Form>
        )}
        {itemList.length ? (
          <>
            <div>
              {currentCount}/{itemList.length}
            </div>
            <table className="table-auto w-full mt-3">
              <thead>
                <tr>
                  <th className="rounded px-4 py-4 text-gray-800 ticky top-0  border border-gray-200 bg-gray-100  ">
                    Email
                  </th>
                  <th className="rounded px-4 py-4 text-gray-800 ticky top-0  border border-gray-200 bg-gray-100  ">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {itemList.map((item) => (
                  <tr key={uuidv4()} className="lg:text-center">
                    <td className="rounded border px-4 py-2">{item.email}</td>
                    <td className="rounded border px-4 py-2">{item.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default newVisitor;
