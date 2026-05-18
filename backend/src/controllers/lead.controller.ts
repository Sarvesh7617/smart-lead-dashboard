import type { Request, Response } from "express";
import Lead from "../model/lead.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Parser } from "json2csv";




const createLead = asyncHandler(async (req: Request, res: Response) => {

    try {

      const {name,email,status,source} = req.body;

      if (!name || !email || !source)
        throw new ApiError(
          400,
          "All fields are required"
        );

      const lead = await Lead.create({
        name,
        email,
        status,
        source,
        createdBy:req.user!._id
      })

      return res.status(201).json(
        new ApiResponse(
          201,
          lead,
          "Lead created successfully"
        )
      );

    } 
    catch (error: unknown) {

      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof Error) {
        throw new ApiError(
          500,
          error.message
        );
      }

      throw new ApiError(
        500,
        "Failed to create lead"
      );
    }
  }
);







const getAllLeads = asyncHandler(async (req: Request, res: Response) => {

    try {

      const {status,source,search,sort,page = "1",} = req.query;

      const query: any = {};



      if (req.user?.role === "sales")
        query.createdBy = req.user._id;



      if (status)
        query.status = status;



      if (source)
        query.source = source;



      if (search) 
      {

        query.$or = [
          {
            name: {
              $regex: search,
              $options: "i",
            },
          },
          {
            email: {
              $regex: search,
              $options: "i",
            },
          },
        ];
      }



      let sortOption = {};

      if (sort === "latest") 
      {

        sortOption = {
          createdAt: -1,
        };
      }



      if (sort === "oldest") 
      {

        sortOption = {
          createdAt: 1,
        };
      }



      const pageNumber = Number(page);

      const limit = 10;

      const skip =(pageNumber - 1) * limit;



      const leads = await Lead.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(limit);



      const totalLeads =await Lead.countDocuments(query);



      return res.status(200).json(
        new ApiResponse(
          200,
          {
            leads,
            pagination: {
              page: pageNumber,
              limit,
              total: totalLeads,
              pages: Math.ceil(totalLeads / limit),
            },
          },
          "Leads fetched successfully"
        )
      );

    } 
    catch (error: unknown) {

      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof Error) {

        throw new ApiError(
          500,
          error.message
        );
      }

      throw new ApiError(
        500,
        "Failed to fetch leads"
      );
    }
  }
);








const getSingleLead = asyncHandler(
  async (req: Request, res: Response) => {

    try {

      const { id } = req.params;

      const lead = await Lead.findById(id);

      if (!lead)
        throw new ApiError(
          404,
          "Lead not found"
        );



      if (
        req.user?.role === "sales" &&
        lead.createdBy.toString() !==
          req.user._id.toString()
      )
        throw new ApiError(
          403,
          "Access denied"
        );



      return res.status(200).json(
        new ApiResponse(
          200,
          lead,
          "Lead fetched successfully"
        )
      );

    } 
    catch (error: unknown) {

      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof Error) {

        throw new ApiError(
          500,
          error.message
        );
      }

      throw new ApiError(
        500,
        "Failed to fetch lead"
      );
    }
  }
);






const updateLead = asyncHandler(
  async (req: Request, res: Response) => {

    try {

      const { id } = req.params;

      const lead = await Lead.findById(id);

      if (!lead)
        throw new ApiError(
          404,
          "Lead not found"
        );



      if (
        req.user?.role === "sales" &&
        lead.createdBy.toString() !==
          req.user._id.toString()
      )
        throw new ApiError(
          403,
          "Access denied"
        );



      const updatedLead =await Lead.findByIdAndUpdate(
          id,
          req.body,
          {
            new: true,
          }
        );



      return res.status(200).json(
        new ApiResponse(
          200,
          updatedLead,
          "Lead updated successfully"
        )
      );

    } 
    catch (error: unknown) {

      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof Error) {

        throw new ApiError(
          500,
          error.message
        );
      }

      throw new ApiError(
        500,
        "Failed to update lead"
      );
    }
  }
);












const deleteLead = asyncHandler(
  async (req: Request, res: Response) => {

    try {

      const { id } = req.params;

      const lead = await Lead.findById(id);

      if (!lead)
        throw new ApiError(
          404,
          "Lead not found"
        );



      if (
        req.user?.role === "sales" &&
        lead.createdBy.toString() !==
          req.user._id.toString()
      )
        throw new ApiError(
          403,
          "Access denied"
        );



      await Lead.findByIdAndDelete(id);



      return res.status(200).json(
        new ApiResponse(
          200,
          {},
          "Lead deleted successfully"
        )
      );

    } 
    catch (error: unknown) {

      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof Error) {

        throw new ApiError(
          500,
          error.message
        );
      }

      throw new ApiError(
        500,
        "Failed to delete lead"
      );
    }
  }
);


const exportLeadsCSV = asyncHandler(
  async (req: Request, res: Response) => {

    const leads = await Lead.find().sort({
      createdAt: -1,
    });

    const fields = [
      "name",
      "email",
      "status",
      "source",
      "createdAt",
    ];

    const json2csv = new Parser({
      fields,
    });

    const csv =
      json2csv.parse(leads);

    res.header(
      "Content-Type",
      "text/csv"
    );

    res.attachment("leads.csv");

    return res.send(csv);
  }
);



export {
  createLead,
  getAllLeads,
  getSingleLead,
  updateLead,
  exportLeadsCSV,
  deleteLead,
};