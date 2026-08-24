using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HMS.Models
{
    // Line items such as Consultation, Laboratory, Pharmacy, Admission charges.
    public class BillItem
    {
        public int Id { get; set; }

        public int BillId { get; set; }
        public Bill? Bill { get; set; }

        [Required, StringLength(150)]
        public string Description { get; set; } = string.Empty;

        [Column(TypeName = "decimal(18,2)")]
        public decimal Amount { get; set; }
    }
}
