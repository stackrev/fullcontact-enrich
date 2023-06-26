import React, { useState, useEffect } from "react";
import Link from "next/link";
import fetch from "isomorphic-unfetch";
import { useRouter } from "next/router";
import { Button, Form, Loader } from "semantic-ui-react";

const newVisitor = () => {
  const [form, setForm] = useState({
    pid: "",
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const router = useRouter();

  useEffect(() => {
    if (isSubmitting) {
      if (Object.keys(errors).length === 0) {
        createVisitor();
      } else {
        setIsSubmitting(false);
      }
    }
  }, [errors]);

  const createVisitor = async () => {
    try {
      const res = await fetch("/api/visitor", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },

        body: JSON.stringify(form),
      });
      router.push("/");
    } catch (err) {
      console.error(err.message);
    }
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
    if (!form.pid) {
      err.pid = "Nama produk diperlukan";
    }
    if (!form.email) {
      err.email = "Email diperlukan";
    }
    return err;
  };

  return (
    <div className="bg-gray-200 h-screen">
      <div className=" flex flex-col justify-center max-w-screen-md mx-auto py-8 antialiased px-10 ">
        <div className="flex justify-between items-center my-8 ">
          <h1 className="text-3xl font-medium">Create Visitor</h1>
          <Link href="/">
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
                errors.pid
                  ? {
                      content: "Harap masukan Nama produk",
                      pointing: "below",
                    }
                  : null
              }
              type="text"
              label="PID"
              name="pid"
              placeholder="PID"
              onChange={handleChange}
            />
            <Form.Input
              error={
                errors.email
                  ? { content: "Harap masukan Email", pointing: "below" }
                  : null
              }
              type="text"
              label="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
            />
            <Button type="submit">Save</Button>
          </Form>
        )}
      </div>
    </div>
  );
};

export default newVisitor;
