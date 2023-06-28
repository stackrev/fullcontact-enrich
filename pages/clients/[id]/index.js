import fetch from "isomorphic-unfetch";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Confirm, Button, Loader, Card, Image } from "semantic-ui-react";
import absoluteUrl from "next-absolute-url";
import { route } from "next/dist/next-server/server/router";
import Link from "next/link";
import JSONTree from "../../../components/JSONTree";

const Client = ({ client }) => {
  return (
    <div className="min-h-screen antialiased bg-gray-200 flex py-8 flex-col items-center justify-center">
      <div className="bg-gray-200 h-screen w-screen-md">
        <div className="flex justify-between items-center ">
          <h1 className="text-3xl font-medium ">View Client</h1>
          <Link href="/clients">
            <a className=" text-md text-gray-700 font-medium hover:text-gray-900 ">
              Back
            </a>
          </Link>
        </div>
        <div className=" overflow-x-auto shadow rounded-lg client my-6 border lg:p-4 bg-white ">
          <b>{client.email}</b>
          <p>id: {client._id}</p>
          <p>PID: {client.pid}</p>
          {/* <div>{JSONTree(client.info)}</div> */}
        </div>
        {/* <Card>
          <Image
            src="https://react.semantic-ui.com/images/wireframe/white-image.png"
            wrapped
            ui={false}
          />
          <Card.Content>
            <Card.Header>{client.email}</Card.Header>

            <Card.Description>
              <p> Information: {client.info}</p>
            </Card.Description>
          </Card.Content>
        </Card> */}
      </div>
    </div>
  );
};

export async function getServerSideProps(context) {
  const id = context.query.id;
  const res = await fetch(`http://localhost:3000/api/client/${id}`);
  const { data } = await res.json();

  return { props: { client: data } };
}

// Client.getInitialProps = async ({ req, query: { id } }) => {
//   const { origin } = absoluteUrl(req, "localhost:3000");

//   const resp = await fetch(`${origin}/api/client/${id}`);
//   const { data } = await resp.json();

//   return { client: data };
// };

export default Client;
