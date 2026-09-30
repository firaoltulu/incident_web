// import { z } from "zod";
const { z } = require("zod");

const AccidentSchema = z.object({
    // 1
    incident_date: z.coerce.date({
        required_error: "Incident date is required!",
    }),
    incident_time: z.string().min(1, "Incident time is required!"),

    // 2Organization
    // organization_name: z.string().min(1, "Organization name is required!"),

    // 3Locations
    // region: z.string().min(1, "Region is required!"),
    // zone: z.string().min(1, "Zone is required!"),
    // city: z.string().min(1, "City is required!"),
    // woreda: z.string().min(1, "Woreda is required!"),
    specific_location: z.string().optional(),

    // 4
    human_injury_on_person: z.string().optional(),
    incident_victim_count: z.number().optional(),
    property_damage_type: z.string().optional(),
    cash_damage_type: z.string().optional(),
    damaged_property_type: z.string().optional(),
    damaged_property_quantity: z.string().optional(),
    damaged_property_estimated_value: z.number().optional(),
    //4.6
    ip_damageToOrganizationBrand: z.string().optional(),
    ip_damageToOrganizationDocumentsAndTechnologies: z.string().optional(),
    ip_handingOverOrganizationalPatents: z.string().optional(),
    ip_unauthorizedUsage: z.string().optional(),
    ip_AmountofDamage: z.string().optional(),
    ip_damage_estimated_value: z.number().optional(),


    // 5 – Accident-related
    accident_cause: z.string().optional(),
    accident_victim_injury: z.string().optional(),
    accident_injured_person_count: z.number().optional(),
    accident_property_damage_quantity: z.string().optional(),
    accident_property_damage_estimated_value: z.number().optional(),
    accident_ip_damage_type: z.string().optional(),
    accident_ip_damage_estimated_value: z.number().optional(),

    // 6
    incident_summary: z.string().min(1, "Incident summary is required!"),

    // 7
    perpetrator_type: z.string().optional(),
    // perpetrator_type: z.string().min(1, "Perpetrator type is required!"),

    // 9
    // legal_action_taken: z.string().optional(),
    administrative_action_taken: z.string().optional(),
    no_action_reason: z.string().optional(),

    // 9 
    suspects_in_custody_count: z.number().default(0),
    suspects_escaped_count: z.number().default(0),
    suspect_unidentified: z.string().optional(),

    // 10 
    follow_up_monitoring_case: z.string().optional(),

    // 11
    additional_comments: z.string().optional(),

    // 12
    reporter_name: z.string().min(1, "Reporter name is required!"),
    // reporter_signature: z.string().optional(),
    report_date: z.coerce.date({
        required_error: "Report date is required!",
    }),
    incident_type: z.string().optional(),
});

module.exports = { AccidentSchema };