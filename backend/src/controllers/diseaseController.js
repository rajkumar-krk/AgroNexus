import Disease from '../models/Disease.js';
import DiseaseReport from '../models/DiseaseReport.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/apiResponse.js';

/** Get diseases list with filters */
export const getDiseases = async (req, res) => {
    try {
        const { cropType, severity, season, search, page = 1, limit = 20 } = req.query;
        const filter = {};
        if (cropType) filter.cropTypes = cropType;
        if (severity) filter.severity = severity;
        if (season) filter.season = season;
        if (search) filter.$or = [{ name: { $regex: search, $options: 'i' } }, { symptoms: { $regex: search, $options: 'i' } }];

        const total = await Disease.countDocuments(filter);
        const diseases = await Disease.find(filter).skip((page - 1) * limit).limit(Number(limit));
        return paginatedResponse(res, diseases, page, limit, total);
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

/** Get single disease */
export const getDisease = async (req, res) => {
    try {
        const disease = await Disease.findById(req.params.id);
        if (!disease) return errorResponse(res, 'Disease not found', 404);
        return successResponse(res, disease);
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

/** Diagnose by symptoms — returns top 5 matching diseases */
export const diagnoseBySymptoms = async (req, res) => {
    try {
        const { cropType, symptoms } = req.body;
        if (!symptoms || !symptoms.length) return errorResponse(res, 'At least one symptom is required', 400);

        const filter = {};
        if (cropType) filter.cropTypes = cropType;
        const diseases = await Disease.find(filter);

        const scored = diseases.map((disease) => {
            const diseaseSymptoms = disease.symptoms.map((s) => s.toLowerCase());
            const inputSymptoms = symptoms.map((s) => s.toLowerCase());
            const matched = inputSymptoms.filter((s) => diseaseSymptoms.some((ds) => ds.includes(s) || s.includes(ds)));
            const confidence = diseaseSymptoms.length > 0 ? matched.length / diseaseSymptoms.length : 0;
            return { disease, confidence: Math.min(confidence, 1), matchedSymptoms: matched };
        });

        const results = scored.filter((s) => s.confidence > 0.15).sort((a, b) => b.confidence - a.confidence).slice(0, 5);

        // Save report
        await DiseaseReport.create({
            farmer: req.user._id,
            cropType,
            symptoms,
            results: results.map((r) => ({ diseaseId: r.disease._id, confidence: r.confidence })),
        });

        return successResponse(res, results.map((r) => ({
            ...r.disease.toObject(),
            confidence: r.confidence,
            matchedSymptoms: r.matchedSymptoms,
        })));
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

/** Get farmer's own disease reports */
export const getMyDiseaseReports = async (req, res) => {
    try {
        const reports = await DiseaseReport.find({ farmer: req.user._id }).populate('diseaseId', 'name severity').sort({ reportedAt: -1 }).limit(50);
        return successResponse(res, reports);
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};
