import React, { useState, useEffect } from "react";
import Link from "next/link";
import fetch from "isomorphic-unfetch";
import { useRouter } from "next/router";
import { Button, Form, Loader, Confirm } from "semantic-ui-react";
import absoluteUrl from "next-absolute-url";

const EditClient = ({ client }) => {
  // State for initial client props
  const [form, setForm] = useState({
    pid: client.pid,
    email: client.email,
    harga: client.harga,
    jumlah: client.jumlah,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // State for delete handler
  const [confirm, setConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const open = () => setConfirm(true);
  const close = () => setConfirm(false);

  const router = useRouter();

  useEffect(() => {
    if (isSubmitting) {
      if (Object.keys(errors).length === 0) {
        updateNote();
      } else {
        setIsSubmitting(false);
      }
    }

    if (isDeleting) {
      deleteClient();
    }
  }, [errors, isDeleting]);

  const deleteClient = async () => {
    const clientId = router.query.id;
    try {
      const deleted = await fetch(`/api/client/${clientId}`, {
        method: "DELETE",
      });
      router.push("/clients");
    } catch (err) {
      console.error(err.message);
    }
  };

  const updateNote = async () => {
    try {
      const res = await fetch(`/api/client/${router.query.id}`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },

        body: JSON.stringify(form),
      });
      router.push("/clients");
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

  const handleDelete = async () => {
    setIsDeleting(true);
    close();
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
          <h1 className="text-3xl font-medium">Edit Client</h1>
          <Link href="/clients">
            <a className=" text-md text-gray-700 font-medium hover:text-gray-900 ">
              Back
            </a>
          </Link>
        </div>
        {isSubmitting ? (
          <Loader active inline="centered" />
        ) : (
          <>
            <Form onSubmit={handleSubmit}>
              <Form.Input
                error={
                  errors.email
                    ? { content: "Harap masukan Email", pointing: "below" }
                    : null
                }
                type="text"
                label="email"
                name="email"
                value={form.email}
                placeholder="Email"
                onChange={handleChange}
              />
              <Form.Input
                readOnly
                type="text"
                label="PID"
                name="pid"
                value={form.pid}
                placeholder="PID"
                onChange={handleChange}
              />
              <div className="py-4">
                <Button disabled type="submit">
                  Update
                </Button>
              </div>
            </Form>

            <div className="delete-button ml-auto">
              <Button inverted color="red" onClick={open}>
                Delete
              </Button>
            </div>
          </>
        )}
      </div>
      <Confirm
        open={confirm}
        onCancel={close}
        cancelButton="Not really"
        confirmButton="Yeep"
        onConfirm={handleDelete}
      />
    </div>
  );
};

export async function getServerSideProps(context) {
  const id = context.query.id;
  const res = await fetch(`http://localhost:3000/api/client/${id}`);
  const { data } = await res.json();

  return { props: { client: data } };
}

// EditClient.getInitialProps = async ({ req, query: { id } }) => {
//   const { origin } = absoluteUrl(req, "localhost:3000");

//   const resp = await fetch(`${origin}/api/client/${id}`);
//   const { data } = await resp.json();

//   return { client: data };
// };

export default EditClient;
