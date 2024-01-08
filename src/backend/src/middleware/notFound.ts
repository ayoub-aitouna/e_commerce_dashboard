import { Request, Response, NextFunction } from 'express';

const notFound = (req: Request, res: Response) => {
    const htmlResponse = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>404 Not Found</title>
        </head>
        <body>
          <center>
            <h1>404 Not Found</h1>
            <hr>
            <p>Default Page</p>
          </center>
        </body>
      </html>
    `;

    res.status(404).send(htmlResponse);
};

export default notFound;